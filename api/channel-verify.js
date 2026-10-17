import { createClient } from "@supabase/supabase-js";

// ==========================================================
// FUTURYCRAFT - CHANNEL VERIFY
// Identifica canal (YouTube/Twitch), inscritos/seguidores,
// ultimo video/live e elegibilidade do Mini YouTuber.
// Tudo server-side; chaves nunca vao para o navegador.
// ==========================================================

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const YT_API_KEY = process.env.YOUTUBE_API_KEY;
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

const CACHE_SECONDS = parseInt(process.env.CHANNEL_VERIFY_CACHE_SECONDS || "600", 10);
const MINI_SUBS_MIN = parseInt(process.env.MINI_SUBS_MIN || "500", 10);
const MINI_LASTVIDEO_DAYS = parseInt(process.env.MINI_LASTVIDEO_DAYS || "30", 10);

const STREAMER_MIN_FOLLOWERS = parseInt(process.env.STREAMER_MIN_FOLLOWERS || "250", 10);
const STREAMER_DAYS_WINDOW = parseInt(process.env.STREAMER_DAYS_WINDOW || "7", 10);
const STREAMER_MIN_STREAM_DAYS = parseInt(process.env.STREAMER_MIN_STREAM_DAYS || "5", 10);

const cache = new Map();

function normalize(url) {
  if (!url || typeof url !== "string") return null;
  return url.trim();
}

// ----------------------------------------------------------
// Extracao de identificador a partir da URL
// ----------------------------------------------------------
function extractId(rawUrl, preferred) {
  const u = normalize(rawUrl);
  if (!u) return null;

  if (/twitch\.tv/i.test(u)) {
    const m = u.match(/twitch\.tv\/([A-Za-z0-9_]{3,})/i);
    return m ? { platform: "twitch", type: "login", id: m[1] } : null;
  }

  if (/youtube\.com|youtu\.be/i.test(u)) {
    let m = u.match(/youtube\.com\/channel\/([A-Za-z0-9_-]{20,})/i);
    if (m) return { platform: "youtube", type: "id", id: m[1] };

    m = u.match(/youtube\.com\/@([A-Za-z0-9._-]+)/i);
    if (m) return { platform: "youtube", type: "handle", id: m[1] };

    m = u.match(/youtube\.com\/user\/([A-Za-z0-9._-]+)/i);
    if (m) return { platform: "youtube", type: "user", id: m[1] };

    m = u.match(/youtube\.com\/c\/([A-Za-z0-9._-]+)/i);
    if (m) return { platform: "youtube", type: "custom", id: m[1] };

    // video (youtu.be/ID ou watch?v=ID) -> resolve dono
    m = u.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/i);
    if (m) return { platform: "youtube", type: "video", id: m[1] };
    m = u.match(/[?&]v=([A-Za-z0-9_-]{6,})/i);
    if (m) return { platform: "youtube", type: "video", id: m[1] };
    m = u.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/i);
    if (m) return { platform: "youtube", type: "video", id: m[1] };
  }

  // handle/ID solto
  const m = u.match(/^@?([A-Za-z0-9._-]{3,})$/);
  if (m) {
    if (String(preferred).toLowerCase() === "twitch") {
      return { platform: "twitch", type: "login", id: m[1] };
    }
    return { platform: "youtube", type: "handle", id: m[1] };
  }

  return null;
}

function rateLimit(key) {
  const now = Date.now();
  const rec = cache.get(key);
  if (rec && now - rec.t < 60000) {
    rec.c++;
    if (rec.c > 10) return false;
  } else {
    cache.set(key, { t: now, c: 1 });
  }
  return true;
}

// ----------------------------------------------------------
// YOUTUBE
// ----------------------------------------------------------
async function ytFetch(path) {
  const sep = path.includes("?") ? "&" : "?";
  const res = await fetch(path + sep + "key=" + encodeURIComponent(YT_API_KEY));
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error("YOUTUBE_HTTP_" + res.status + (txt ? ":" + txt.slice(0, 120) : ""));
  }
  return res.json();
}

async function ytSearchChannelId(query) {
  const j = await ytFetch(
    "https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=1&q=" +
      encodeURIComponent(query)
  );
  const it = j.items && j.items[0];
  if (!it || !it.id || !it.id.channelId) return null;
  return it.id.channelId;
}

async function ytChannelById(id) {
  const j = await ytFetch(
    "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=" +
      encodeURIComponent(id)
  );
  return (j.items && j.items[0]) || null;
}

async function resolveYoutubeChannel(ex) {
  if (!YT_API_KEY) throw new Error("YOUTUBE_MISSING_KEY");

  let channel = null;

  if (ex.type === "id") {
    channel = await ytChannelById(ex.id);
  } else if (ex.type === "handle") {
    const j = await ytFetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&forHandle=" +
        encodeURIComponent("@" + ex.id.replace(/^@/, ""))
    );
    channel = (j.items && j.items[0]) || null;
    if (!channel) {
      const cid = await ytSearchChannelId(ex.id);
      if (cid) channel = await ytChannelById(cid);
    }
  } else if (ex.type === "user") {
    const j = await ytFetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&forUsername=" +
        encodeURIComponent(ex.id)
    );
    channel = (j.items && j.items[0]) || null;
    if (!channel) {
      const cid = await ytSearchChannelId(ex.id);
      if (cid) channel = await ytChannelById(cid);
    }
  } else if (ex.type === "video") {
    const vj = await ytFetch(
      "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + encodeURIComponent(ex.id)
    );
    const vit = vj.items && vj.items[0];
    if (vit && vit.snippet && vit.snippet.channelId) {
      channel = await ytChannelById(vit.snippet.channelId);
    }
  } else {
    const cid = await ytSearchChannelId(ex.id);
    if (cid) channel = await ytChannelById(cid);
  }

  if (!channel) throw new Error("YOUTUBE_CHANNEL_NOT_FOUND");

  // Ultimo video pelo playlist de uploads do canal
  let lastVideoAt = null;
  let lastVideoId = null;
  let lastVideoTitle = null;
  const uploads =
    channel.contentDetails &&
    channel.contentDetails.relatedPlaylists &&
    channel.contentDetails.relatedPlaylists.uploads;

  if (uploads) {
    const pj = await ytFetch(
      "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=5&playlistId=" +
        encodeURIComponent(uploads)
    );
    const items = (pj.items || []).filter((it) => {
      const t = it.snippet && it.snippet.title;
      return t !== "Private video" && t !== "Deleted video";
    });
    if (items.length) {
      // ordena por data desc (uploads normalmente ja vem ordenado)
      items.sort((a, b) => {
        const da = new Date(a.contentDetails && a.contentDetails.videoPublishedAt || a.snippet.publishedAt).getTime();
        const db = new Date(b.contentDetails && b.contentDetails.videoPublishedAt || b.snippet.publishedAt).getTime();
        return db - da;
      });
      const first = items[0];
      lastVideoAt =
        (first.contentDetails && first.contentDetails.videoPublishedAt) ||
        (first.snippet && first.snippet.publishedAt) ||
        null;
      lastVideoId = first.contentDetails && first.contentDetails.videoId;
      lastVideoTitle = first.snippet && first.snippet.title;
    }
  }

  const stats = channel.statistics || {};
  const hidden = stats.hiddenSubscriberCount === true;

  return {
    platform: "youtube",
    channel_id: channel.id,
    channel_handle: (channel.snippet && (channel.snippet.customUrl || channel.snippet.title)) || channel.id,
    title: channel.snippet && channel.snippet.title,
    avatar:
      channel.snippet &&
      channel.snippet.thumbnails &&
      ((channel.snippet.thumbnails.high && channel.snippet.thumbnails.high.url) ||
        (channel.snippet.thumbnails.default && channel.snippet.thumbnails.default.url) ||
        null),
    subscribers: hidden ? null : parseInt(stats.subscriberCount, 10) || null,
    hidden_subs: hidden,
    video_count: parseInt(stats.videoCount, 10) || null,
    view_count: parseInt(stats.viewCount, 10) || null,
    last_video_at: lastVideoAt,
    last_video_id: lastVideoId,
    last_video_title: lastVideoTitle,
    verification_data: {
      id: channel.id,
      title: channel.snippet && channel.snippet.title,
      customUrl: channel.snippet && channel.snippet.customUrl,
      publishedAt: channel.snippet && channel.snippet.publishedAt,
      statistics: stats
    }
  };
}

// ----------------------------------------------------------
// TWITCH
// ----------------------------------------------------------
async function getTwitchToken() {
  if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) throw new Error("TWITCH_MISSING_CREDS");
  const params = new URLSearchParams();
  params.append("client_id", TWITCH_CLIENT_ID);
  params.append("client_secret", TWITCH_CLIENT_SECRET);
  params.append("grant_type", "client_credentials");
  const res = await fetch("https://id.twitch.tv/oauth2/token", { method: "POST", body: params });
  if (!res.ok) throw new Error("TWITCH_TOKEN_FAIL");
  const j = await res.json();
  return j.access_token;
}

async function twitchGet(path, token) {
  const res = await fetch(path, {
    headers: { "Client-ID": TWITCH_CLIENT_ID, Authorization: "Bearer " + token }
  });
  if (!res.ok) throw new Error("TWITCH_HTTP_" + res.status);
  return res.json();
}

async function resolveTwitch(ex) {
  if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) throw new Error("TWITCH_MISSING_CREDS");
  const token = await getTwitchToken();

  const login = String(ex.id || "").toLowerCase().replace(/^@/, "");
  const uj = await twitchGet(
    "https://api.twitch.tv/helix/users?login=" + encodeURIComponent(login),
    token
  );
  const user = uj.data && uj.data[0];
  if (!user) throw new Error("TWITCH_NOT_FOUND");

  let followers = null;
  try {
    const fj = await twitchGet(
      "https://api.twitch.tv/helix/channels/followers?first=1&broadcaster_id=" +
        encodeURIComponent(user.id),
      token
    );
    followers = typeof fj.total === "number" ? fj.total : null;
  } catch (e) { /* follower count e opcional */ }

  let lastStreamAt = null;
  let lastStreamTitle = null;
  let isLive = false;
  try {
    const sj = await twitchGet(
      "https://api.twitch.tv/helix/streams?first=1&user_id=" + encodeURIComponent(user.id),
      token
    );
    const st = sj.data && sj.data[0];
    if (st && st.started_at) {
      lastStreamAt = st.started_at;
      lastStreamTitle = st.title;
      isLive = true;
    }
  } catch (e) { /* segue para videos */ }

  let streamDays = 0;
  let vodCount = 0;
  let vodData = false;
  try {
    const vj = await twitchGet(
      "https://api.twitch.tv/helix/videos?first=30&type=archive&sort=time&user_id=" +
        encodeURIComponent(user.id),
      token
    );
    vodData = true;
    const lista = (vj.data || []).filter((v) => v && v.created_at);
    vodCount = lista.length;
    if (lista.length && !lastStreamAt) {
      lastStreamAt = lista[0].created_at;
      lastStreamTitle = lista[0].title;
    }
    const cutoff = Date.now() - STREAMER_DAYS_WINDOW * 86400000;
    const dias = new Set();
    for (const v of lista) {
      const t = new Date(v.created_at).getTime();
      if (Number.isFinite(t) && t >= cutoff) {
        dias.add(new Date(v.created_at).toISOString().slice(0, 10));
      }
    }
    if (isLive) dias.add(new Date().toISOString().slice(0, 10));
    streamDays = dias.size;
  } catch (e) { /* sem historico */ }

  return {
    platform: "twitch",
    channel_id: user.id,
    channel_handle: user.display_name || user.login,
    title: user.display_name,
    avatar: user.profile_image_url || null,
    followers,
    last_stream_at: lastStreamAt,
    last_stream_title: lastStreamTitle,
    is_live: isLive,
    stream_days: streamDays,
    vod_count: vodCount,
    vod_data: vodData,
    verification_data: {
      id: user.id,
      login: user.login,
      display_name: user.display_name,
      created_at: user.created_at,
      description: user.description
    }
  };
}

// ----------------------------------------------------------
// ELEGIBILIDADE MINI YOUTUBER (>= 500 inscritos + video <= 30d)
// ----------------------------------------------------------
function checkMiniYoutube(res) {
  const out = { eligible: false, status: "ineligible", reasons: [] };
  const subs = res.subscribers;

  if (res.hidden_subs || subs == null) {
    out.status = "manual_review";
    out.reasons.push("subscribers_unavailable");
    return out;
  }

  const subsOk = subs >= MINI_SUBS_MIN;
  if (!subsOk) out.reasons.push("subs_lt_" + MINI_SUBS_MIN);

  let recentOk = false;
  if (!res.last_video_at) {
    out.reasons.push("no_recent_video_found");
  } else {
    const diff = (Date.now() - new Date(res.last_video_at).getTime()) / 86400000;
    if (diff <= MINI_LASTVIDEO_DAYS) recentOk = true;
    else out.reasons.push("last_video_over_" + MINI_LASTVIDEO_DAYS + "d");
  }

  if (subsOk && recentOk) {
    out.eligible = true;
    out.status = "eligible";
    out.reasons = [];
  }
  return out;
}

// ----------------------------------------------------------
// ELEGIBILIDADE STREAMER (Twitch: >= 250 seguidores +
// >= 5 dias com live nos ultimos 7 dias).
// Outras plataformas -> revisao manual (sem regra automática).
// ----------------------------------------------------------
function checkStreamer(res) {
  const out = { eligible: false, status: "ineligible", reasons: [] };

  if (res.platform !== "twitch") {
    out.status = "manual_review";
    out.reasons.push("no_auto_rule");
    return out;
  }

  if (res.followers == null) {
    out.status = "manual_review";
    out.reasons.push("followers_unavailable");
    return out;
  }

  const days = res.stream_days || 0;

  // Sem historico de VOD e sem live agora: nao da para medir frequencia.
  if ((res.vod_count || 0) === 0 && !res.is_live) {
    out.status = "manual_review";
    out.reasons.push("no_stream_data");
    if (res.followers < STREAMER_MIN_FOLLOWERS) {
      out.reasons.push("followers_lt_" + STREAMER_MIN_FOLLOWERS);
    }
    return out;
  }

  const followersOk = res.followers >= STREAMER_MIN_FOLLOWERS;
  if (!followersOk) out.reasons.push("followers_lt_" + STREAMER_MIN_FOLLOWERS);

  const daysOk = days >= STREAMER_MIN_STREAM_DAYS;
  if (!daysOk) out.reasons.push("stream_days_lt_" + STREAMER_MIN_STREAM_DAYS);

  if (followersOk && daysOk) {
    out.eligible = true;
    out.status = "eligible";
    out.reasons = [];
  }
  return out;
}

// ----------------------------------------------------------
// HANDLER
// ----------------------------------------------------------
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "METHOD_NOT_ALLOWED" });
  }

  try {
    const { url, platform, formType } = req.body || {};
    const ex = extractId(url || "", platform);
    if (!ex) {
      return res
        .status(400)
        .json({ success: false, error: "INVALID_URL", message: "Formato de URL invalido." });
    }

    const requested = String(platform || "").toLowerCase();
    if (requested && requested !== ex.platform) {
      return res
        .status(400)
        .json({ success: false, error: "PLATFORM_MISMATCH", message: "Plataforma nao confere." });
    }

    const key = (ex.platform + ":" + ex.id + ":" + (formType || "")).toLowerCase();
    if (!rateLimit(key)) {
      return res.status(429).json({ success: false, error: "RATE_LIMIT" });
    }

    let result;
    if (ex.platform === "youtube") {
      result = await resolveYoutubeChannel(ex);
    } else if (ex.platform === "twitch") {
      result = await resolveTwitch(ex);
    } else {
      return res.status(400).json({ success: false, error: "UNSUPPORTED" });
    }

    let eligibility = { status: "manual_review", eligible: false, reasons: [] };
    const tipoForm = String(formType).toLowerCase();
    if (tipoForm === "youtuber") {
      eligibility = checkMiniYoutube(result);
    } else if (tipoForm === "streamer") {
      eligibility = checkStreamer(result);
    }

    return res.status(200).json({
      success: true,
      platform: result.platform,
      channel_id: result.channel_id,
      channel_handle: result.channel_handle,
      title: result.title,
      avatar: result.avatar,
      subscribers: result.subscribers != null ? result.subscribers : null,
      followers: result.followers != null ? result.followers : null,
      hidden_subs: !!result.hidden_subs,
      video_count: result.video_count != null ? result.video_count : null,
      view_count: result.view_count != null ? result.view_count : null,
      last_video_at: result.last_video_at || null,
      last_video_title: result.last_video_title || null,
      last_stream_at: result.last_stream_at || null,
      last_stream_title: result.last_stream_title || null,
      is_live: !!result.is_live,
      stream_days: result.stream_days != null ? result.stream_days : null,
      verified_at: new Date().toISOString(),
      cache_seconds: CACHE_SECONDS,
      eligibility,
      verification_data: result.verification_data || {}
    });
  } catch (e) {
    console.error("[channel-verify]", e);
    return res.status(502).json({ success: false, error: e.message || "UNKNOWN" });
  }
}

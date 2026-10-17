import { createClient } from "@supabase/supabase-js";

// FUTURYCRAFT - CHANNEL VERIFY
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const YT_API_KEY = process.env.YOUTUBE_API_KEY;
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

const CACHE_SECONDS = parseInt(process.env.CHANNEL_VERIFY_CACHE_SECONDS || "600", 10);
const cache = new Map();

const YT_REGEX = /(?:youtube\.com\/(?:channel\/|c\/|@|user\/)|youtu\.be\/)([^\s\/?&]+)/i;
const TWITCH_REGEX = /(?:twitch\.tv\/)([^\s\/?&]+)/i;

function normalize(url) {
  if (!url || typeof url !== "string") return null;
  return url.trim();
}

function extractId(url) {
  const u = normalize(url);
  if (!u) return null;
  let m = u.match(/youtube\.com\/channel\/([A-Za-z0-9_-]{24})/i);
  return {
    platform: "youtube",
    channel_id: channelId,
    channel_handle: item.snippet && (item.snippet.customUrl || (item.snippet.title || "")),
    title: item.snippet && item.snippet.title,
    avatar: item.snippet && item.snippet.thumbnails && ((item.snippet.thumbnails.high && item.snippet.thumbnails.high.url) || (item.snippet.thumbnails.default && item.snippet.thumbnails.default.url)),
    subscribers: parseInt(item.statistics && item.statistics.subscriberCount, 10) || null,
    last_video_at: lastVideoAt,
    hidden_subs: item.statistics && item.statistics.hiddenSubscriberCount === true,
    verification_data: item
  };
  return null;
}

function rateLimit(key) {
  const now = Date.now();
  const rec = cache.get(key) || { t: 0, c: 0 };
  if (now - rec.t > 60000) { rec.t = now; rec.c = 1; cache.set(key, rec); return true; }
  rec.c++;
  cache.set(key, rec);
  return rec.c <= 5;
}

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

async function verifyYoutube(ex) {
  if (!YT_API_KEY) throw new Error("YOUTUBE_MISSING_KEY");
  let channelId = ex.id;
  if (ex.type !== "id") {
    const search = await fetch(`https://www.googleapis.com/youtube/v3/search?part=id&q=&type=channel&maxResults=1&key=);
    if (!search.ok) throw new Error("YOUTUBE_SEARCH_FAIL");
    const search = await fetch(https://www.googleapis.com/youtube/v3/search?part=id&q=&type=channel&maxResults=1&key=);
    if (!search.ok) throw new Error("YOUTUBE_SEARCH_FAIL");
    const sj = await search.json();
    const it = sj.items && sj.items[0];
    if (!it || !it.id || !it.id.channelId) throw new Error("YOUTUBE_CHANNEL_NOT_FOUND");
    channelId = it.id.channelId;
  }
  const ch = await fetch(https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=&key=);
  if (!ch.ok) throw new Error("YOUTUBE_CHANNEL_FAIL");
  const cj = await ch.json();
  const uploads = item.contentDetails && item.contentDetails.relatedPlaylists && item.contentDetails.relatedPlaylists.uploads;
  let lastVideoAt = null;
  if (uploads) {
    const pl = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=5&playlistId=&key=);
    if (pl.ok) {
      const pj = await pl.json();
      const itv = pj.items && pj.items[0];
      if (itv && itv.snippet && itv.snippet.publishedAt) lastVideoAt = itv.snippet.publishedAt;
    }
    platform: "youtube",
    channel_id: channelId,
    channel_handle: item.snippet && (item.snippet.customUrl || (item.snippet.title || "")),
    title: item.snippet && item.snippet.title,
    avatar: item.snippet && item.snippet.thumbnails && (item.snippet.thumbnails.high && item.snippet.thumbnails.high.url || item.snippet.thumbnails.default && item.snippet.thumbnails.default.url),
    subscribers: parseInt(item.statistics && item.statistics.subscriberCount, 10) || null,
    last_video_at: lastVideoAt,
    hidden_subs: item.statistics && item.statistics.hiddenSubscriberCount === true,
    verification_data: item
  };
}

async function verifyTwitch(ex) {
  if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) throw new Error("TWITCH_MISSING_CREDS");
  const token = await getTwitchToken();
  const q = await fetch(https://api.twitch.tv/helix/users?login=, {
    headers: { "Client-ID": TWITCH_CLIENT_ID, "Authorization": "Bearer " + token }
  });
  if (!q.ok) throw new Error("TWITCH_USER_FAIL");
  const qj = await q.json();
  const user = qj.data && qj.data[0];
  if (!user) throw new Error("TWITCH_NOT_FOUND");
  let followers = null;
  let lastStreamAt = null;
  try {
    const f = await fetch(https://api.twitch.tv/helix/channels/followers?broadcaster_id=&first=1, {
      headers: { "Client-ID": TWITCH_CLIENT_ID, "Authorization": "Bearer " + token }
    });
    if (f.ok) {
      const fj = await f.json();
      followers = fj.total || null;
    }
  } catch (e) {}
  try {
    const s = await fetch(https://api.twitch.tv/helix/streams?user_id=&first=1, {
      headers: { "Client-ID": TWITCH_CLIENT_ID, "Authorization": "Bearer " + token }
    });
    if (s.ok) {
      const sj = await s.json();
      const st = sj.data && sj.data[0];
      if (st && st.started_at) lastStreamAt = st.started_at;
    }
  } catch (e) {}
  return {
    platform: "twitch",
    channel_id: user.id,
    channel_handle: user.display_name || user.login,
    title: user.display_name,
    avatar: user.profile_image_url,
    followers: followers,
    last_stream_at: lastStreamAt,
    verification_data: user
  };
}

function checkMiniYoutube(res) {
  const out = { eligible: false, reasons: [], status: "ineligible" };
  const subs = res.subscribers;
  if (subs == null || subs < 0) {
    out.status = "manual_review";
    out.reasons.push("subscribers_unavailable");
    return out;
  }
  if (subs < 500) {
    out.reasons.push("subs_lt_500");
    out.note = "need >=500";
  }
  if (!res.last_video_at) {
    out.status = "ineligible";
    out.reasons.push("no_recent_video_found");
  } else {
    const last = new Date(res.last_video_at);
    const now = new Date();
    const diff = (now - last) / (1000 * 60 * 60 * 24);
    if (diff > 30) {
      out.reasons.push("last_video_over_30d");
    }
  }
  if (subs >= 500 && res.last_video_at) {
    const last = new Date(res.last_video_at);
    const diff = (Date.now() - last.getTime()) / (86400000);
    if (diff <= 30) {
      out.eligible = true;
      out.status = "eligible";
      out.reasons = [];
    }
  }
  return out;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "METHOD_NOT_ALLOWED" });
  try {
    const { url, platform, formType } = req.body || {};
    const ex = extractId(url || "");
    if (!ex) return res.status(400).json({ success: false, error: "INVALID_URL", message: "Formato de URL invalido" });
    if (platform && platform.toLowerCase() === "twitch" && ex.platform !== "twitch") return res.status(400).json({ success: false, error: "PLATFORM_MISMATCH" });
    const key = (ex.platform + ":" + ex.id + ":" + (formType||"")).toLowerCase();
    if (!rateLimit(key)) return res.status(429).json({ success: false, error: "RATE_LIMIT" });
    let result;
    if (ex.platform === "youtube") {
      result = await verifyYoutube(ex);
    } else if (ex.platform === "twitch") {
      result = await verifyTwitch(ex);
    } else {
      return res.status(400).json({ success: false, error: "UNSUPPORTED" });
    }
    let eligibility = { status: "manual_review", eligible: false, reasons: [] };
    if (formType === "youtuber") eligibility = checkMiniYoutube(result);
    return res.status(200).json({
      success: true,
      platform: result.platform,
      channel_id: result.channel_id,
      channel_handle: result.channel_handle,
      title: result.title,
      avatar: result.avatar,
      subscribers: result.subscribers,
      followers: result.followers,
      last_video_at: result.last_video_at,
      last_stream_at: result.last_stream_at,
      hidden_subs: result.hidden_subs,
      verified_at: new Date().toISOString(),
      eligibility,
      verification_data: result.verification_data
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, error: e.message || "UNKNOWN" });
  }
}

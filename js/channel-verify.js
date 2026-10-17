// FUTURYCRAFT - CHANNEL VERIFY CLIENT
(function() {
  const API = '/api/channel-verify';
  window.ChannelVerify = {
    async verify(url, platform, formType) {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, platform, formType })
      });
      if (!res.ok) throw new Error('VERIFY_FAIL');
      return await res.json();
    }
  };
})();

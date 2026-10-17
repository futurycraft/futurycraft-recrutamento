// FUTURYCRAFT - CHANNEL VERIFY CLIENT
(function () {
  const API = '/api/channel-verify';

  function mensagemErro(status, data) {
    if (status === 404) return 'USD_ENDPOINT_AUSENTE';
    if (status === 429) return 'RATE_LIMIT';
    if (data && data.error) return data.error;
    return 'HTTP_' + status;
  }

  window.ChannelVerify = {
    async verify(url, platform, formType) {
      let res;
      try {
        res = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, platform, formType })
        });
      } catch (e) {
        var err = new Error('NETWORK');
        err.code = 'NETWORK';
        throw err;
      }

      let data = null;
      try { data = await res.json(); } catch (e) { /* resposta sem json */ }

      if (!res.ok || !data || data.success === false) {
        var erro = new Error(mensagemErro(res.status, data));
        erro.code = (data && data.error) || ('HTTP_' + res.status);
        erro.status = res.status;
        throw erro;
      }

      return data;
    }
  };
})();

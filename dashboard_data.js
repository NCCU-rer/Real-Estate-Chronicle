(function (global) {
  const DATA_URL = './json';
  let dataPromise = null;

  async function requestData() {
    const response = await fetch(DATA_URL, {
      cache: 'no-store',
      credentials: 'omit',
    });
    if (!response.ok) {
      throw new Error(`載入本地資料失敗：${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  function loadDashboardData() {
    if (global.NCCU_DASHBOARD_DATA) {
      return Promise.resolve(global.NCCU_DASHBOARD_DATA);
    }
    if (!dataPromise) {
      dataPromise = requestData()
        .then((data) => {
          global.NCCU_DASHBOARD_DATA = data;
          return data;
        })
        .catch((error) => {
          dataPromise = null;
          throw error;
        });
    }
    return dataPromise;
  }

  global.loadDashboardData = loadDashboardData;
})(typeof window !== 'undefined' ? window : this);



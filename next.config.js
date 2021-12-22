module.exports = {
  rewrites() {
    return [
      {
        source: '/api/database/mongo/get',
        destination: '/api/database/mongo/get/all',
      },
    ];
  },
};

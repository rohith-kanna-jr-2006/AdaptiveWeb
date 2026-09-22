/**
 * GET /api/health
 * Returns service health status.
 */
const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      service: 'AdaptiveWeb'
    }
  });
};

module.exports = {
  getHealth
};

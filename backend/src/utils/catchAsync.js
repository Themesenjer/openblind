/**
 * Envuelve controladores asíncronos para capturar excepciones automáticamente
 * y pasarlas al middleware global de errores (errorHandler) mediante next(err).
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;

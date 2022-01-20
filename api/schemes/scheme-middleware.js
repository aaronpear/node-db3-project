const db = require('../../data/db-config.js');

const checkSchemeId = async (req, res, next) => {
  try {
    const scheme = await db('schemes').where('scheme_id', req.params.scheme_id).first();
    if (scheme) {
      next();
    } else {
      next({ message: `scheme with scheme_id ${req.params.scheme_id} not found`, status: 404 });
    }
  } catch (err) {
    next(err);
  }
}

const validateScheme = (req, res, next) => {
  const { scheme_name } = req.body;

  if (!scheme_name || typeof scheme_name !== 'string') {
    next({ status: 400, message: 'invalid scheme_name' });
  } else {
    next();
  }
}

const validateStep = (req, res, next) => {
  const { instructions, step_number } = req.body;

  if (!instructions || 
    typeof instructions !== 'string' || 
    typeof step_number !== 'number' || 
    step_number < 1) {
      next({ status: 400, message: 'invalid step' });
  } else {
    next();
  }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}

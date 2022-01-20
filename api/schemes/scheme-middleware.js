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

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  const { scheme_name } = req.body;

  if (!scheme_name || typeof scheme_name !== 'string') {
    next({ status: 400, message: 'invalid scheme_name' });
  } else {
    next();
  }
}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {

}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}

const db = require('../../data/db-config.js');

async function find() { // EXERCISE A

  const rows = await db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .groupBy('sc.scheme_id')
    .select('sc.scheme_id as scheme_id', 'scheme_name')
    .count('st.step_id as number_of_steps')
  return rows;
}

async function findById(scheme_id) { // EXERCISE B

  const rows = await db('schemes as sc')
      .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
      .select('scheme_name', 'sc.scheme_id as scheme_id', 'st.step_id as step_id', 'step_number', 'instructions')
      .orderBy('step_number', 'asc')
      .where('sc.scheme_id', scheme_id);

  const result = {
    scheme_id: rows[0].scheme_id,
    scheme_name: rows[0].scheme_name,
    steps: rows.reduce((steps, step) => {
      if(!step.step_id) return steps;
      const { step_id, step_number, instructions } = step;
      return steps.concat({ step_id, step_number, instructions });
    }, [])
  }

  return result;
}

async function findSteps(scheme_id) { // EXERCISE C

  const rows = await db('schemes as sc')
      .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
      .select('scheme_name', 'st.step_id as step_id', 'step_number', 'instructions')
      .orderBy('step_number', 'asc')
      .where('sc.scheme_id', scheme_id);

  const result = rows.reduce((steps, step) => {
      if(!step.step_id) return steps;
      const { step_id, step_number, instructions } = step;
      return steps.concat({ step_id, step_number, instructions, scheme_name: rows[0].scheme_name });
  }, [])

  return result;
}

function add(scheme) { // EXERCISE D
  return db('schemes')
    .insert(scheme)
    .then(([scheme_id]) => { // eslint-disable-line
      return findById(scheme_id)
    })
}

function addStep(scheme_id, step) { // EXERCISE E
  return db('steps').insert({ ...step, scheme_id })
    .then(() => {
      return db('steps as st')
        .join('schemes as sc', 'sc.scheme_id', 'st.scheme_id')
        .select('step_id', 'step_number', 'instructions', 'scheme_name')
        .orderBy('step_number')
        .where('sc.scheme_id', scheme_id);
    })
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}

import cnx from '../db.js';

export const findPaitent = async (first_name, last_name) => {
    const query = `
      SELECT * FROM "patient"
      WHERE "firstname" = $1 AND "lastname" = $2;
    `;
    const values = [first_name, last_name];
  
    try {
      const result = await cnx.query(query, values);
      return result.rows[0]; // Return the first matching row
    } catch (error) {
      console.error('Error finding patient:', error);
      throw error; // Re-throw the error for handling elsewhere
    }
};

export const findPaitentByFN = async (first_name) => {
  const query = `
    SELECT * FROM "patient"
    WHERE "firstname" = $1;
  `;
  const values = [first_name];
  try{
    const result = await cnx.query(query, values);
    return result.rows[0];
  }catch(error){
    console.error('Error finding patient:', error);
    throw error;
  }
}
export const findPaitentByEmail = async (email) => {
  const query = `
    SELECT * FROM "patient"
    WHERE email = $1;
  `;
  const values = [email];
  try {
    const result = await cnx.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const insertPatient = async (first_name, last_name, email, number, birth_day, age, address, dr_id) => {
    const query = `
      INSERT INTO "patient" ("firstname", "lastname", email, number, "birthday", age, "address", selected_doctor, "password" )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const values = [first_name, last_name, email, number, birth_day, age, address, dr_id, '123'];
  
    try {
      const result = await cnx.query(query, values);
      return result.rows[0]; // Return the inserted row
    } catch (error) {
      console.error('Error inserting patient:', error);
      throw error; // Re-throw the error for handling elsewhere
    }
};

export const modifyPatient = async (idPatient, first_name, last_name, email, number, birth_day, age, address) => {
    const query = `
        UPDATE "patient"
        SET "firstname" = $1, "lastname" = $2, email = $3, number = $4, "birthday" = $5, age = $6, "address" = $7
        WHERE id = $8
        RETURNING *;
    `;
    const values = [first_name, last_name, email, number, birth_day, age, address, idPatient];
  
    try {
      const result = await cnx.query(query, values);
      return result.rows[0]; // Return the updat row
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error; // Re-throw the error for handling elsewhere
    }
}

export const findPaitentById = async (id) => {
  const query = `
    SELECT * FROM "patient"
    WHERE id = $1;
  `;
  const values = [id];

  try {
    const result = await cnx.query(query, values);
    return result.rows[0]; // Return the first matching row
  } catch (error) {
    console.error('Error finding patient:', error);
    throw error; // Re-throw the error for handling elsewhere
  }
};

export const dropPatient = async (id) => {
  await cnx.query('DELETE FROM "patient" WHERE id = $1;', [id]);
}

export const allPatients = async () => {
  const result = await cnx.query('SELECT * FROM "patient";');
  return result.rows;
};

export const allPatientsOfDoctor = async (dr_id) => {
  const query = `
    SELECT * FROM "patient"
    WHERE selected_doctor = $1;
  `;
  const values = [dr_id];
  try {
    const result = await cnx.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error finding patient:', error);
    throw error;
  }
}

export const sendPatient = async (patient_id, dr_id) => {
  const query = `
    UPDATE "patient"
    SET selected_doctor = $1
    WHERE id = $2
    RETURNING *;
  `;
  const values = [dr_id, patient_id];
  try {
    const result = await cnx.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error finding patient:', error);
    throw error;
  }
}

export const getDrListPatient = async (dr_id, appointDay) => {
  const query = `
      SELECT * 
      FROM appointment_status 
      WHERE doctor_id = $1 
      AND DATE(appoint_day) = $2;
  `
  const values = [dr_id, appointDay];
  try{
    const result = await cnx.query(query, values);
    return result.rows;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const updatePatientCheck = async (appointStatusId) => {
  const query = `
    UPDATE appointment_status
    SET status = 'checked_in',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1 
    RETURNING *;
  `;
  const values = [appointStatusId];
  try {
    const result = await cnx.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating patient check:', error);
    throw error;
  }
}


export const updatePatientCompleted = async (appointStatusId) => {
  const query = `
      UPDATE appointment_status SET status = 'completed' WHERE id = $1 RETURNING *;
  `;
  const values = [appointStatusId];

  try {
      const result = await cnx.query(query, values);
      return result.rows[0]; 
  } catch (error) {
      console.log(error);
      throw error;
  }
}

export const getUpcomingPatients = async (doctor_id, limit = 5) => {
  const query = `
    SELECT 
      a.id,
      a.patient_id,
      p.firstname as patient_firstname,
      p.lastname as patient_lastname,
      p.email as patient_email,
      a.appoint_day,
      a.status,
      ROW_NUMBER() OVER (ORDER BY a.appoint_day ASC) as queue_position
    FROM 
      appointment_status a
    JOIN 
      patient p ON a.patient_id = p.id
    WHERE 
      a.doctor_id = $1 
      AND a.status = 'scheduled'
      AND DATE(a.appoint_day) >= DATE(NOW())
    ORDER BY 
      a.appoint_day ASC
    LIMIT $2;
  `;

  try {
    const result = await cnx.query(query, [doctor_id, limit]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching upcoming patients:', error);
    throw error;
  }
};

export const updatePassword = async (id, password) => {
  const query = `
    UPDATE "patient"
    SET "password" = $1
    WHERE id = $2
    RETURNING *;
  `;
  const values = [password, id];
  try {
    const result = await cnx.query(query, values);
    return result.rows[0]; // Return the updated row
  } catch (error) {
    console.error('Error updating password:', error);
    throw error; // Re-throw the error for handling elsewhere
  }
}
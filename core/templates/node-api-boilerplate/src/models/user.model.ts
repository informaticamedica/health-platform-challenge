import { v4 } from "uuid";
import pool from "../db/postgres";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

const UserModel = {
  // Método para crear un nuevo usuario
  async create({ name, email, password }: Omit<User, "id">): Promise<User> {
    const query = `
      INSERT INTO users (id,name, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email
    `;

    const values = [v4(), name, email, password];

    try {
      const res = await pool.query(query, values);
      return res.rows[0]; // Retorna el usuario creado
    } catch (err) {
      console.error("Error al crear usuario:", err);
      throw new Error("Error al crear usuario");
    }
  },

  // Método para buscar un usuario por su email
  async findOne({ email }: Pick<User, "email">): Promise<User | null> {
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];

    try {
      const res = await pool.query(query, values);
      return res.rows.length > 0 ? res.rows[0] : null; // Retorna el usuario si existe
    } catch (err) {
      console.error("Error al buscar usuario:", err);
      throw new Error("Error al buscar usuario");
    }
  },
  // Método para buscar un usuario por su id
  async findById(id: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE id = $1";
    const values = [id];

    try {
      const res = await pool.query(query, values);
      return res.rows.length > 0 ? res.rows[0] : null; // Retorna el usuario si existe
    } catch (err) {
      console.error("Error al buscar usuario por id:", err);
      throw new Error("Error al buscar usuario por id");
    }
  },
};

export default UserModel;

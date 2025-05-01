import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Usuario: a
    .model({
      nombre: a.string().required(),
      correo: a.string().required(),
      dni: a.string(), // Nuevo campo para el D.N.I.
      cuil: a.string(), // Nuevo campo para el CUIL
      tramite: a.string(), // Nuevo campo para el Número de Trámite
      contrasena: a.string().required(), 
      rol: a.enum(["Estudiante", "Administrador", "Profesor"]),
    })
    .authorization((allow) => [allow.publicApiKey()]),

    
      PropiedadAlquiler: a
      .model({
        direccion: a.string().required(),
        ubicacion: a.string().required(),
        tipoPropiedad: a.string().required(), // Sin validación de valores específicos
        precioAlquiler: a.float().required(),
        precioExpensas: a.float(),
        habitaciones: a.integer(),
        ambientes: a.integer(),
        antiguedad: a.integer(),
        banos: a.integer(),
        cochera: a.string(), // "Si" o "No" pero sin validación
        metrosCuadrados: a.float().required(),
        mapLink: a.string(), // URL como string normal
        descripcion: a.string(),
        imagenes: a.string(), // Cadena JSON simple
        estado: a.string().default("Disponible"), // Sin validación de valores
        destacada: a.boolean().default(false),
        fechaPublicacion: a.datetime(),
        caracteristicas: a.string().array(),
        fotos360: a.string().array(),
        youtubeVideoUrl: a.string(),
       
      })
      .authorization(allow => [allow.publicApiKey()]),

      PropiedadVenta: a
      .model({
        direccion: a.string().required(),
        ubicacion: a.string().required(),
        tipoPropiedad: a.string().required(), // Sin validación de valores específicos
        precioVenta: a.float().required(),
        precioExpensas: a.float(),
        habitaciones: a.integer(),
        ambientes: a.integer(),
        antiguedad: a.integer(),
        banos: a.integer(),
        cochera: a.string(), // "Si" o "No" pero sin validación
        metrosCuadrados: a.float().required(),
        mapLink: a.string(), // URL como string normal
        descripcion: a.string(),
        imagenes: a.string(), // Cadena JSON simple
        estado: a.string().default("Disponible"), // Sin validación de valores
        destacada: a.boolean().default(false),
        fechaPublicacion: a.datetime(),
        caracteristicas: a.string().array(),
        fotos360: a.string().array(),
        youtubeVideoUrl: a.string(),
        
      })
      .authorization(allow => [allow.publicApiKey()]),
    

});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>

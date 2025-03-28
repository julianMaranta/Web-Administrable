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
      cursosComprados: a.hasMany("CursoComprado", "usuarioId"),
      especializacionesCompradas: a.hasMany("EspecializacionComprada", "usuarioId"),
      
     
    })
    .authorization((allow) => [allow.publicApiKey()]),

    Curso: a
    .model({
      nombre: a.string().required(),
      descripcion: a.string(),
      linkPago: a.string(),
      driveLink: a.string(),
      profesores: a.string().array(), // Se cambia para almacenar múltiples profesores
      cantidadDeAlumnos: a.integer().required(),
      clases: a.hasMany("Clase", "cursoId"),
      cursosComprados: a.hasMany("CursoComprado", "cursoId"),
      videoUrl: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

    Especializacion: a
    .model({
      nombre: a.string().required(),
      descripcion: a.string(),
      imagen: a.string(),
      linkPago: a.string(),
      driveLink: a.string(),
      profesores: a.string().array(), // Se cambia para almacenar múltiples profesores
      cantidadDeAlumnos: a.integer().required(),
      clases: a.hasMany("Clase", "especializacionId"),
      especializacionesCompradas: a.hasMany("EspecializacionComprada", "especializacionId"),
      videoUrl: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

    CursoComprado: a
    .model({
      usuarioId: a.id().required(),
      cursoId: a.id().required(),
      usuario: a.belongsTo("Usuario", "usuarioId"),
      curso: a.belongsTo("Curso", "cursoId"),
      usuarioNombre: a.string(),  // Nuevo campo
      usuarioCorreo: a.string(),  // Nuevo campo
    })
    .authorization((allow) => [allow.publicApiKey()]),

    EspecializacionComprada: a
    .model({
      usuarioId: a.id().required(),
      especializacionId: a.id().required(),
      usuario: a.belongsTo("Usuario", "usuarioId"),
      especializacion: a.belongsTo("Especializacion", "especializacionId"),
      usuarioNombre: a.string(),  // Nuevo campo
      usuarioCorreo: a.string(),  // Nuevo campo
    })
    .authorization((allow) => [allow.publicApiKey()]),

    Clase: a
    .model({
      nombre: a.string().required(),
      tematica: a.string().required(),
      cursoId: a.id(), // Opcional si la clase pertenece a un curso
      curso: a.belongsTo("Curso", "cursoId"),
      especializacionId: a.id(), // Opcional si la clase pertenece a una especialización
      especializacion: a.belongsTo("Especializacion", "especializacionId"),
      tutoriaId: a.id(), // Opcional si la clase pertenece a una tutoría
      tutoria: a.belongsTo("Tutoria", "tutoriaId"),
      fecha: a.date(), // Campo requerido para la fecha de la clase
      hora: a.time(), // Campo requerido para la hora de la clase
      youtubeVideoUrl: a.string(),
      imagenes: a.json(), // Cambiado de string a json para almacenar enlaces y títulos
      texto: a.string(),
      zoomLink: a.string(), // Nuevo campo para el link de Zoom
      driveLinkClase: a.string(),
      pdfClase: a.string(), 
      index: a.integer(), // Nuevo campo para almacenar un índice
      
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
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

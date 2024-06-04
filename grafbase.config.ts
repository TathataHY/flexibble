import { auth, config, g } from "@grafbase/sdk";
import { TypeFieldShape } from "@grafbase/sdk/dist/src/type";

// Welcome to Grafbase!
//
// Configure authentication, data sources, resolvers and caching for your GraphQL API.

// const g = graph.Standalone();

// @ts-ignore
const User = g
  .model("User", {
    name: g.string().length({ min: 1, max: 255 }) as unknown as TypeFieldShape,
    email: g.string(),
    avatarUrl: g.url(),
    description: g
      .string()
      .length({ min: 2, max: 1000 })
      .optional() as unknown as TypeFieldShape,
    githubUrl: g.url().optional(),
    linkedinUrl: g.url().optional(),
    projects: g
      .relation(() => Project)
      .list()
      .optional(),
  })
  .auth((rules) => {
    rules.public().read();
  });

// @ts-ignore
const Project = g
  .model("Project", {
    title: g.string().length({ min: 3 }) as unknown as TypeFieldShape,
    description: g.string(),
    image: g.url(),
    liveSiteUrl: g.url(),
    githubUrl: g.url(),
    category: g.string().search(),
    createdBy: g.relation(() => User),
  })
  .auth((rules) => {
    rules.public().read();
    rules.private().create().delete().update();
  });

// Data Sources - https://grafbase.com/docs/connectors
//
// const pg = connector.Postgres('pg', { url: g.env('DATABASE_URL') })
// g.datasource(pg)

// Resolvers - https://grafbase.com/docs/resolvers
//
// g.query('helloWorld', {
//   returns: g.string(),
//   resolver: 'hello-world',
// })

const jwt = auth.JWT({ issuer: "grafbase", secret: g.env("NEXTAUTH_SECRET") });

export default config({
  schema: g,
  // Authentication - https://grafbase.com/docs/auth
  auth: {
    // OpenID Connect
    // const oidc = auth.OpenIDConnect({ issuer: g.env('OIDC_ISSUER_URL') })
    providers: [jwt],
    rules: (rules) => {
      rules.private();
    },
  },
  // Caching - https://grafbase.com/docs/graphql-edge-caching
  // cache: {
  //   rules: [
  //     {
  //       types: ['Query'], // Cache everything for 60 seconds
  //       maxAge: 60,
  //       staleWhileRevalidate: 60
  //     }
  //   ]
  // }
});

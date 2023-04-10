// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  components: [
    {
      path: '~/components', // will auto import any component within /components
      pathPrefix: false,
    },
  ],

  imports: {
    dirs: ['lib/composables'],
  },

  modules: ['@nuxtjs/apollo', 'nuxt-graphql-server'],

  css: ['@/assets/css/main.css'],

  graphqlServer: {
    schema: './database/graphql/models/schema.gql',
  },

  apollo: {
    clients: {
      default: {
        httpEndpoint: `${process.env.BASE_URL}/api/graphql`,
      },
    },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          '@': ['.'],
          '@/*': ['./*'],
        },
      },
    },
  },
})

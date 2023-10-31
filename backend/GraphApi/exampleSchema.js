const schema = {
    typeDefs: gql`
      type Nutrition {
        flavorId: ID
        calories: Int
        fat: Int
        sodium: Int
      }
  
      type Flavor {
        id: ID
        name: String
        description: String
        nutrition: Nutrition
      }
  
      type Query {
        flavors(id: ID): [Flavor]
      }
  
      type Mutation {
        updateFlavor(id: ID!, name: String, description: String): Flavor
      }
    `,
    resolvers: {
      Query: {
        flavors: (parent, args) => {
          // Предполагается, что args равно объекту, наподобие { id: '1' }
          return mongodb.collection('flavors').find(args).toArray()
        },
      },
      Mutation: {
        updateFlavor: (parent, args) => {
          // Предполагается, что args равно объекту наподобие { id: '1', name: 'Movie Theater Clone', description: 'Bring the movie theater taste home!' }
  
          // Выполняем обновление.
  
          mongodb.collection('flavors').update(args)
  
          // Возвращаем flavor после обновления.
  
          return mongodb.collection('flavors').findOne(args.id)
        },
      },
      Flavor: {
        nutrition: (parent) => {
          return mongodb.collection('nutrition').findOne({
            flavorId: parent.id,
          })
        }
      },
    },
  }
  
  export default schema
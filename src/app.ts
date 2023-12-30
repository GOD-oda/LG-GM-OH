import { Client } from "@notionhq/client";
import 'dotenv/config'

const env = {
  NOTION_TOKEN: process.env.NOTION_TOKEN,
  MASTER_DATABASE_ID: process.env.MASTER_DATABASE_ID,
  ACQUISITION_DATABASE_ID: process.env.ACQUISITION_DATABASE_ID
}

const notion = new Client({
  auth: env.NOTION_TOKEN,
})

async function users() {
  const listUsersResponse = await notion.users.list({})
  return listUsersResponse;
}

async function allCards() {
  if (!env.MASTER_DATABASE_ID) throw new Error('MASTER_DATABASE_ID is not defined')

  const res = await notion.databases.query({
    database_id: env.MASTER_DATABASE_ID,
    // filter: {
    //   property: 'Type',
    //   select: {
    //     equals: '魔法'
    //   }
    // }
  })
  return res.results;
}

async function saveCard(card: any) {
  if (!env.ACQUISITION_DATABASE_ID) throw new Error('ACQUISITION_DATABASE_ID is not defined')

  const res = await notion.pages.create({
    parent: {
      database_id: env.ACQUISITION_DATABASE_ID,
    },
    cover: card.cover,
    properties: card.properties,
  })
  return res;
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const cards = await allCards();
  const cardTotalNumber = cards.length;
  const index = getRandomNumber(0, cardTotalNumber - 1)
  //
  const card = cards[index];
  // TODO: OwnerはPR作成者
  // @ts-ignore
  card.properties.Owner = {
    type: "people",
    people: [
      {
        id: "64164962-514b-4967-89cc-73d2fd0e5fd4"
      }
    ]
  }
  const res = await saveCard(cards[index]);
}


main()

import cron from 'node-cron'
import { getScraping, updateScraping } from '../scraping/web-scraping.js';

export const cronEveryMonday = () => {

  cron.schedule('0 6 * * 1', async () => {
    console.log('running a task add matches At 06:00 on Monday.');
    for (let i = -1; i < 7; i++) {
      let today = new Date()
      today.setDate(today.getDate() + i)
      const newDate= today.toISOString().split("T")[0].split('-')
      await getScraping(newDate[0],newDate[1],newDate[2])
    }
  });
}

export const cronEveryDayFirst = () => {

  cron.schedule('0 6 * * 0-7', async () => {
    console.log('running a task update matches At 06:00 on every day-of-week from Sunday through Sunday.');
    for (let i = -1; i < 7; i++) {
      let today = new Date()
      today.setDate(today.getDate() + i)
      console.log(today)
      const newDate= today.toISOString().split("T")[0].split('-')
      await updateScraping(newDate[0],newDate[1],newDate[2])
    }
  });

}

export const cronEveryDaySecond = () => {

  cron.schedule('0 12 * * 0-7', async () => {
    console.log('running a task update matches At 12:00 on every day-of-week from Sunday through Sunday.');
    for (let i = -1; i < 7; i++) {
      let today = new Date()
      today.setDate(today.getDate() + i)
      console.log(today)
      const newDate= today.toISOString().split("T")[0].split('-')
      await updateScraping(newDate[0],newDate[1],newDate[2])
    }
  });
  
}

export const cronEveryDayThird = () => {

  cron.schedule('0 17 * * 0-7', async () => {
    console.log('running a task update matches At 17:00 on every day-of-week from Sunday through Sunday.');
    for (let i = -1; i < 7; i++) {
      let today = new Date()
      today.setDate(today.getDate() + i)
      console.log(today)
      const newDate= today.toISOString().split("T")[0].split('-')
      await updateScraping(newDate[0],newDate[1],newDate[2])
    }
  });
  
}
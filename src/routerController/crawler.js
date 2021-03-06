/* eslint-disable class-methods-use-this */
import superagent from 'superagent'
import cheerio from 'cheerio'
import File from '../utils/file'

class Crawler {
  // 爬取腾讯微博
  async getLeaderboards() {
    try {
      const htmlMsg = await superagent.get(
        'https://www.hltv.org/stats/leaderboards?event=4921'
      )
      const $ = cheerio.load(htmlMsg.text)
      const data = []
      $('.standard-box').each((i, item) => {
        const it = $(item)
        const leaderPicture = it.find('.leader-picture').attr('src')

        const flag = it.find('.flag').attr('src')

        const standardHeadline = it
          .prev()
          .find('span')
          .text()
        // 获取人名
        const leaderName =
          $(it.find('.leader-name .gtSmartphone-only')[0]).text() +
          it.find('.leader-name a').text() +
          $(it.find('.leader-name .gtSmartphone-only')[1]).text()

        const leaderRating = $(it.find('.leader-rating span')[0]).text()

        const leaderTeam = it.find('.leader-team a').text()
        // RUNNER UP
        const runnerData = []
        // eslint-disable-next-line array-callback-return
        it.find('.runner-up').map((j, obj) => {
          const ob = $(obj)

          const runnerImg = ob.find('img').attr('src')

          const runnerName = $(ob.find('a')[0]).text()

          const runnerTeam = $(ob.find('a')[1]).text()

          const runnerImgTrue = `https://static.hltv.org/images/playerprofile/thumb/${parseInt(
            $(ob.find('a')[0])
              .attr('href')
              .split('/')[3]
          )}/400.jpeg?v=4`

          const runnerRatio = $(ob.children('span:last-child')).text()
          runnerData.push({
            runnerImg,
            runnerName,
            runnerTeam,
            runnerRatio,
            runnerImgTrue
          })
        })
        if (leaderName && leaderName != '') {
          data.push({
            standardHeadline,
            leaderPicture,
            flag,
            leaderName,
            leaderRating,
            leaderTeam,
            runnerData
          })
        }
      })
      await File.writeFile('leaderData.json', JSON.stringify(data))
      return {
        status: '1',
        type: 'success_get_cnblogs',
        message: 'success',
        data
      }
    } catch (err) {
      return {
        status: '0',
        type: 'error_get_qqweibo',
        message: err.toString()
      }
    }
  }
}
export default new Crawler()

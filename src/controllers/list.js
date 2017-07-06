import temp from '@common/common.js'
import $ from 'jQuery'
const fn = (temp) => {
  console.log(temp)
}
(async() => {
  try {
      // 获取用户名
    const data = await $.ajax({
      type: 'GET',
      url: '/static/json/test.json'
    })
    console.log(data.err.msg)
  } catch (err) {
    console.error(err)
  }
})()
fn(temp)

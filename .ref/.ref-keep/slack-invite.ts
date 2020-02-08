// Invite to slack
// const { data } = await axios.request({
//   method: "get",
//   url: encodeURI(
//     `https://slack.com/api/users.admin.invite?token=${process.env.SLACK_LEGACY_API_TOKEN}&email=${email}&channels=CG24NJBU1&resend=true`
//   )
// })

// Make sure to remove circular refs
// https://github.com/WebReflection/flatted#flatted
// const { stringify } = require("flatted/cjs")
// notifySlack({
//   pretext: `Slack Invite Sent to ${email}`,
//   title: "Slack Invite Sent",
//   text: stringify(data)
// })

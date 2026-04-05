export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  console.log('Successfully received subscription data:', body)

  return {
    success: true,
    message: 'Subscription successfully created!',
    data: body
  }
})

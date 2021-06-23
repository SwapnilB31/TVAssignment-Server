require('dotenv').config()
const express = require('express')
const cors = require('cors')
const formidable = require('express-formidable')
const {Pool} = require('pg')
const app = express()
app.use(formidable())

app.use(cors())

const pool = new Pool()

const listener = app.listen(process.env.PORT,() => {
  console.log(`Server is now running on port ${listener.address().port}`)
})


app.post('/searchRestaurants',async (req,res) => {
  const {formats, occasions, priceRange, sortBy} = req.fields
  const query = genSearchQuery(formats,occasions,priceRange,sortBy)
  console.log(query)
  try{
    const result =  await pool.query(query)
    res.status(200).json(result.rows)
  }
  catch(err) {
    console.warn(err)
    res.status(500).json({error : "Server Error! Couldn't fetch Data."})
  }
})

app.get('/getFrequentRestaurants',async (req,res) => {
  const query = 'SELECT "name", "address" FROM public."RestaurantList" ORDER BY RANDOM() LIMIT 4'
  try {
    const result = await pool.query(query)
    res.status(200).json(result.rows)
  } catch(err) {
    console.warn(err)
    res.status(500).json({error : "Server Error! Couldn't fetch Data."})
  }
})

/**
 * 
 * @param {[String]} formats 
 * @param {[String]} occasions 
 * @param {[Number,Number]} priceRange 
 * @param {String} sortBy 
 * @returns 
 */
function genSearchQuery(formats,occasions,priceRange,sortBy) {
  let query = 'SELECT "name", "price", "ratings", "numRatings", "mealType", "address" FROM public."RestaurantList"'
  const prQuery = genPriceRangequery(priceRange)
  const ocQuery = genOcassionQuery(occasions)
  const frQuery = genFormatsQuery(formats)
  if(prQuery !== '' || occasions.lenth > 0 || formats.length > 0)
    query += ' WHERE '
  if(genPriceRangequery(priceRange) !== '')
    query += prQuery
  if(formats.length > 0) {
    if(prQuery !== '')
      query += ' AND '
    query += frQuery
  }
  if(occasions.length > 0) {
    if(formats.length > 0 || prQuery !== '')
      query += ' AND '
    query += ocQuery
  }
  if(sortBy !== "Most Popular") {
    if(sortBy === "Price")
      query += ' ORDER BY price ASC'
    else if(sortBy === "Ratings")
      query += ' ORDER BY ratings DESC'
  }
  return query
}

/**
 * 
 * @param {[String]} formats 
 */
 function genFormatsQuery(formats) {
  return formats.map(format => `CAST(format ->> '${format}' AS BOOLEAN) = true`).join(' AND ')
}

/**
 * 
 * @param {[String]} occasions 
 * @returns 
 */
function genOcassionQuery(occasions) {
  return occasions.map(occasion => `CAST(occasion ->> '${occasion}' AS BOOLEAN) = true`).join(' AND ')
}

/**
 * 
 * @param {[Number,Number]} priceRange 
 */
function genPriceRangequery(priceRange) {
  if(priceRange[0] === 0 && priceRange[1] === 3000)
    return ''
  if(priceRange[1] === 3000)
    return `price >= ${priceRange[0]}`
  return `price BETWEEN ${priceRange[0]} AND ${priceRange[1]}`
}

import express from 'express'
import Urls from "../Models/Urls.js"
import crypto from 'crypto'

const getRandomString = ( string, len ) => {
    let randomString = ''

    while (len) {
        randomString += string[Math.floor(Math.random() * string.length)]
        len--
    }

    return randomString
}

export const postLink = (req, res) => {
    try {
        const characters = "1234567890qwertasdfghjklxcvbnmQWERTOASDFGHJKZXCVM()'!~*"
        const shortLink = `${getRandomString(characters, 9)}`

        Urls.findOne( { link : req.body.link }, (err, foundUrl) => {
            if (err) {
                console.log(err)
            } else {
                if ( foundUrl ) {
                    res.status(200).send(foundUrl.shortLink)
                } else {
                    Urls.findOne({ shortLink : shortLink }, (err, foundUrl) => {
                        if (err) {
                            console.log(err)
                        } else {
                            if ( foundUrl ) {
                                postLink(req, res)
                            } else {
                                const inputData = {
                                    shortLink : shortLink,
                                    link : req.body.link
                                }
                        
                                const newUrl = new Urls( inputData )
                                newUrl.save((err, data) => {
                                    if (err) return console.log(err)
                                    console.log(data)
                                })
                        
                                res.status(200).send(shortLink)                    
                            }
                        }
                    })
                }
            }
        })


    } catch (error) {
        console.log(error)
        // console.log(req.body)
        res.status(404).send({ message : error.message })
    }
}

export const getLink = (req, res) => {
    try {
        const shortLink = req.params.shortLink
        
        Urls.findOne({ shortLink : shortLink }, ( error, foundUrl ) => {
            if (error) {
                console.log(error)
            } else {
                res.status(200).redirect(foundUrl.link)
            }
        })
    } catch (error) {
        console.log(error)
    }
}
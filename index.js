const inputLink = document.getElementById('inputLink')
const postLink = document.getElementById('postLink')
const form = document.querySelector('#form')
const displayELement = document.querySelectorAll('.display');
const shortLink = document.getElementById('shortLink')
const statusMessage = document.getElementById('status')
const response = document.getElementById('shortLink')
const loader = document.getElementById('loader')

// const url = 'http://127.0.0.1:8000'
const url = 'https://urlsrtnr.onrender.com/'

const displaythem = () => {
    displayELement.forEach((e) => {
        e.style.visibility = 'visible';
    })

    response.style.marginBlock = '1rem';
}

const hidethem = () => {
    displayELement.forEach((e) => {
        e.style.visibility = 'hidden';
    })
    response.style.marginBlock = '0rem';
}

const active = (tag) => {
    tag.style.display = 'grid'
}

const inactive = (tag) => {
    tag.style.display = 'none'
}

inputLink.addEventListener('input', () => {
    hidethem();
    active(loader);
    inactive(shortLink);
    shortLink.innerText = "";
    statusMessage.innerText = "";
})

postLink.addEventListener('click', () => {
    let link = inputLink.value

    if (!(link.startsWith('https://'))) {
        inputLink.value = 'https://' + link
    }
})

form.addEventListener('submit', async (event) => {
    event.preventDefault()
    displaythem();
    if (inputLink.value) {
        const data = { link: inputLink.value }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        }

        statusMessage.innerText = 'Please wait '

        const res = await fetch(`${url}/link`, options)
        const chunk = await res.json()

        if (chunk) {
            inactive(loader)
            active(shortLink)
            statusMessage.innerText = chunk.existing ? 'Linked Already Existed!!!' : 'Link Created Successfully.'
            shortLink.innerText = `${url}/${chunk.shortUrl}`
        }
    }

})

shortLink.addEventListener('click', (e) => {
    navigator.clipboard.writeText(shortLink.innerText);
    alert(`${shortLink.innerText} Copied to clipboard`)
})

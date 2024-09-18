from flask import current_app as app
from flask import g
from pyhead import Head


# make the head tag available to all templates
@app.before_request
def inject_pyhead():
    g.head = Head(
        title="I Do Sets",
        description="A workout webapp; focused towards doing sets.",
        robots="noindex, nofollow",
        theme_color="#1E242FFF",
        referrer_policy="no-referrer",
        favicon={
            "ico_icon_16_32_href": "/favicon.ico",
        },
        opengraph_website={
            "site_name": "I Do Sets",
            "title": "I Do Sets",
            "description": "A workout webapp; focused towards doing sets.",
            "image": "https://idosets.app/img/facebook.jpg",
            "image_alt": "I Do Sets Logo",
            "url": "https://idosets.app",
            "locale": "en_GB",
        },
        twitter_card={
            "card": "summary",
            "title": "I Do Sets",
            "description": "A workout webapp; focused towards doing sets.",
            "image": "https://idosets.app/img/twitter.jpg",
            "image_alt": "I Do Sets Logo",
            "url": "https://idosets.app",
        },
    )

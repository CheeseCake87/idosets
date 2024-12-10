from flask import current_app as app
from flask import g
from pyhead import Head


# make the head tag available to all templates
@app.before_request
def inject_pyhead():
    head = Head(
        title="I Do Sets",
        description="A workout webapp; focused towards doing sets.",
        robots="noindex, nofollow",
        theme_color="#1E242FFF",
        referrer_policy="no-referrer",
    )
    head.set_favicon(
        ico_icon_href="/favicon.ico",
    )
    head.set_opengraph_website(
        site_name="I Do Sets",
        title="I Do Sets",
        description="A workout webapp; focused towards doing sets.",
        image="https://idosets.app/img/facebook.jpg",
        image_alt="I Do Sets Logo",
        url="https://idosets.app",
        locale="en_GB",
    )
    head.set_twitter_card(
        card="summary",
        title="I Do Sets",
        description="A workout webapp; focused towards doing sets.",
        image="https://idosets.app/img/twitter.jpg",
        image_alt="I Do Sets Logo",
        url="https://idosets.app",
    )

    g.head = head

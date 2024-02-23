import {createEffect, createSignal, onMount, Show} from 'solid-js'

import screenshot_large from '../screenshot-large.png'
import screenshot_home from '../screenshot-home.png'
import screenshot_logs from '../screenshot-logs.png'

export default function Index() {
    const DEV = import.meta.env.DEV
    const API_URL = DEV ? import.meta.env.VITE_FLASK_URL : ''

    const [themeVar, setThemeVar] = createSignal('dark')

    async function getFetch(url) {
        const response = await fetch(url, {
            credentials: 'include', method: 'GET'
        })

        if (response.ok) {
            return await response.json()
        }
    }

    async function getTheme() {
        return await getFetch(`${API_URL}/api/get/theme`)
    }

    async function setTheme(theme) {
        return await getFetch(`${API_URL}/api/set/theme/${theme}`)
    }

    let html

    onMount(() => {
        html = document.querySelector('html')
        getTheme().then(json => {
            setThemeVar(json.theme)
        })
    })
    createEffect(() => {
        html.setAttribute('data-theme', themeVar())
    })

    return (
        <>
            <div className={'container'}>
                <div className={'text-center p-10'}>
                    <h1 className={'text-6xl mb-5'}>💪 I Do Sets</h1>
                    <p>A workout app focused on doing sets.</p>
                    <button
                        type="button"
                        className={'button-good mt-10'}
                        onClick={() => {
                            window.location.href = '/login'
                        }}>
                        Login / Signup
                    </button>
                </div>
                <div className={'flex justify-center'}>
                    <Show when={themeVar() === 'dark'}>
                        <button
                            className={'flex rounded-full'}
                            onClick={() => {
                                setTheme('light').then(json => {
                                    setThemeVar(json.theme)
                                })
                            }}
                        >
                            <span className="material-icons-round">light_mode</span>
                        </button>
                    </Show>

                    <Show when={themeVar() === 'light'}>
                        <button
                            className={'flex rounded-full'}
                            onClick={() => {
                                setTheme('dark').then(json => {
                                    setThemeVar(json.theme)
                                })
                            }}>
                            <span className="material-icons-round">dark_mode</span>
                        </button>
                    </Show>
                </div>
            </div>
            <div className={'container'}>
                <img src={screenshot_large}
                     className={'w-full rounded-lg shadow-2xl mb-4'}
                     alt="Screenshot of setting a workout"/>
            </div>
            <div className={'container flex justify-center fp-screenshots gap-4'}>
                <div className={'flex flex-grow justify-center'}>
                    <img src={screenshot_home}
                         className={'rounded-lg shadow-2xl'}
                         alt="Screenshot of the workouts page"/>
                </div>
                <div className={'flex flex-grow justify-center'}>
                    <img src={screenshot_logs}
                         className={'rounded-lg shadow-2xl'}
                         alt="Screenshot of workout logs"/>
                </div>
            </div>
            <div className={'flex flex-col gap-2 text-sm text-center p-8'}
                 xmlns:cc="http://creativecommons.org/ns#"
                 xmlns:dct="http://purl.org/dc/terms/">
                <p className={'opacity-70'}>
                    <a property="dct:title" rel="cc:attributionURL" href="https://idosets.app">
                        idosets.app</a> is licensed under
                </p>

                <p>
                    <a href="http://creativecommons.org/licenses/by-nc-nd/4.0/?ref=chooser-v1"
                       target="_blank"
                       rel="license noopener noreferrer"
                       className={'flex justify-center underline opacity-70 hover:opacity-90'}>
                        CC BY-NC-ND 4.0
                    </a>
                </p>
                <div className={'flex flex-row justify-center pb-4'}>
                    <img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;"
                         src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"/>
                    <img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;"
                         src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"/>
                    <img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;"
                         src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"/>
                    <img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;"
                         src="https://mirrors.creativecommons.org/presskit/icons/nd.svg?ref=chooser-v1"/>
                </div>
                <p>
                    <a className={'underline opacity-70 hover:opacity-90'}
                       href="https://github.com/CheeseCake87/idosets.app"
                       target={'_blank'}> GitHub
                    </a>
                </p>

            </div>
            <div className={'container text-sm p-8'}>
                <h3 className={'text-center pb-4'}>The boring stuff...</h3>
                <h4>Privacy Policy</h4>
                <p>This app stores the following personal information</p>
                <ul className={'list-disc p-5'}>
                    <li>Email Address</li>
                    <li>Workout Data</li>
                </ul>
                <p className={'pb-2'}>This data is stored in a secure database and is not, and will never be shared with
                    any third
                    party.</p>
                <p>To delete your account, login, then navigate to Account, then Delete Account. Your email address,
                    workouts, and workout logs will be completely deleted. There is no way of reversing this.</p>
                <h4 className={'mt-6'}>Cookie Policy</h4>
                <p>This app uses cookies to store your login session data.
                    The following values are stored on your computer in order for this website to work:</p>
                <ul className={'list-disc p-5'}>
                    <li>[authentication markers]</li>
                    <li>theme</li>
                    <li>units</li>
                </ul>
                <p>This website does not directly use third party cookies. However, when storing a workout
                    instruction link, the system will find the favicon of the website entered. This link
                    may attempt to set third party cookies on your computer (youtube will attempt this).
                    Using the Google Chrome web browser will block this.</p>
                <h4 className={'mt-6'}>Terms and Conditions</h4>
                <p>By using this website, you agree to the following:</p>
                <ul className={'list-disc p-5'}>
                    <li>You will not use this website for any illegal activity</li>
                    <li>You will not attempt to use this website to harm others</li>
                </ul>
                <p className={'pb-2'}>This site is under the jurisdiction of the United Kingdom, by using this
                    site you agree to settle any legal matters within the United Kingdom.</p>
                <p>This site does not address persons under the age of 13; You are not to use
                    this site if you are under this age. If you are the parent or guardian of an account
                    found to be on this site which has been made by a person of this age please login
                    to the account, navigate to Account, then Delete Account.</p>
            </div>
        </>
    )
};

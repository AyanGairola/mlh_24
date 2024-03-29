import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { login, logout } from './store/authSlice'
import { Footer, Header } from './Components'
import { Outlet } from 'react-router-dom'


function App() {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    (async () => {
      console.log(localStorage)
      if (localStorage.getItem("refreshToken")) {
        console.log("here")
        setLoading(true)
        try {
          const userData = await fetch("https://blogify-sz1l.onrender.com/users/current-user", {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              refreshToken: localStorage.getItem("refreshToken"),
              accessToken: localStorage.getItem("accessToken")
            })
          })
          const data = await userData.json()
          console.log(data)
          dispatch(login(data.data))
        } catch (err) {
          console.log(err)
          dispatch(logout())
        } finally {
          setLoading(false)
        }
      }

    })()

  }, [localStorage])

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between text-white bg-[#00040F] '>
      <div className="w-full block">
        <Header />
        <main>
          <Outlet/>
        </main>
        <Footer />
      </div>
      <div className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient" />
      <div className="absolute z-[0] w-[30%] h-[30%] -left-1/2 bottom-0 rounded-full blue__gradient" />
    </div>
  ) : null
}

export default App

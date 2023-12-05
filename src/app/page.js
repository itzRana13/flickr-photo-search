'use client'

import Photo from './_photo'
import Header from './_header'
import ToTop from './_toTop'
import Loading from './_loading'
import Error from './_error'
import NoMoreResults from './_noMoreResults'
import useSWRIfinite from 'swr/infinite';
import { useState, useEffect } from 'react'
import fetchData from './helpers/fetchData';

export default function Home() {
  const [input, setInput] = useState('landscape')

  function getKey (pageIndex, previousPageData) {
    if (previousPageData && !previousPageData.photos.photo.length) {
      return null
    }

    return {
      input,
      page: pageIndex
    }
  }

  const { data, error, isLoading, isValidating, size, setSize } = useSWRIfinite(getKey, fetchData, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    dedupingInterval: 60000,
    revalidateFirstPage: false
  })

  const reachedEnd = data && !data[data.length - 1].photos.photo.length

  function handleScroll () {
    if (reachedEnd) return

    if (document.body.scrollHeight < window.scrollY + window.innerHeight + 100) {
      if (!isLoading && !error && !isValidating) {
        setSize(size + 1)
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  function getPhotos () {
    if (!data) return
    let photos = data.map(page => page.photos.photo).flat(1)
    
   
    photos = photos.filter((value, index, array) => {
      let foundIndex = array.findIndex(item => item.id === value.id)
      return foundIndex === index
    })

    return photos
  }

  const photos = getPhotos()

  if (error) {
    console.error(error)
  }

  return (
    <div className="w-full min-h-screen pb-24 pt-4 bg-slate-100">
      <Header setInput={setInput} />
      <div className="w-5/6 mx-auto text-center pt-4 pb-4">
        {data && photos && photos.map((photo) => (
          <Photo photo={photo} key={photo.id} />
        ))}
        {(!data || isLoading || isValidating) && !error && (<Loading />)}
        {error && (<Error />)}
        {reachedEnd && (<NoMoreResults />)}
        <ToTop />
      </div>
    </div>
  )
}

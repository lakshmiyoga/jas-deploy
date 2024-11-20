import React from 'react'
import { Helmet } from 'react-helmet-async'

const MetaData = ({ title, description }) => {
  return (
    <Helmet>
      <title>{`${title} - JAS`}</title>
      <meta name="description" content={description || 'Best fruits and vegetables online'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description || 'Best fruits and vegetables online'} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.jasfruitsandvegetables.in" />
      <meta property="og:image" content="/metaImage1.png" />
      <meta name="robots" content="index, follow" />
    </Helmet>
  )
}

export default MetaData
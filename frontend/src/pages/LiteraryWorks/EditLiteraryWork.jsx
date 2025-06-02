import React from 'react'
import WorkForm from './WorkForm'

const EditLiteraryWork = ({ user }) => {
  return <WorkForm user={user} isEditMode={true} />
}

export default EditLiteraryWork 
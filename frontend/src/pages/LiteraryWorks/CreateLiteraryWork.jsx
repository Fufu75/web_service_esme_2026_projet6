import React from 'react'
import WorkForm from './WorkForm'

const CreateLiteraryWork = ({ user }) => {
  return <WorkForm user={user} isEditMode={false} />
}

export default CreateLiteraryWork 
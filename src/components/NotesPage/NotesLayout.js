import React from 'react'
import { GiWhiteBook } from 'react-icons/gi'
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io'

export const NotesLayout = (props) => {
  return (

        <div className='notes--detail'>
            <div className='level' onClick={() => props.toggleFunc(`${props.id}`)}>
                <h2> {props.level} Level Notes </h2>
                {props.show && <h2><IoIosArrowForward /></h2>}
                {!props.show && <h2><IoIosArrowDown /></h2>}
            </div>
            <div id={props.id}>
                {props.noteSet.length > 0 
                    ?
                props.noteSet.map((notes, index) => {
                    return <div className="note--title">
                                <p>
                                    <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                    {/* Reduce note title/name to max 50 chars  */}
                                    <span>{notes.noteName.length > 50 ? notes.noteName.slice(0,50) + '...' : notes.noteName}
                                            <small><i> ({notes.type})</i></small> 
                                    </span>
                                </p>
                                <div>
                                    <small>Upload Date: {notes.uploadDate}</small>
                                    <small>Uploaded By: {notes.uploadedBy}</small>
                                    <button>
                                        <a href={notes.url}>Download</a>
                                    </button>
                                </div>
                            </div>
                            })
                            :
                        <p>NO NOTE ADDED YET... Help us upload one. 😊</p>
                }
            </div>
        </div>
      
)
}

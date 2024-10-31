function TextField({id, content, onChange, value}: {id: string, content: string, onChange: (e: any) => void , value: string}) {
    return (
        <>
            <label htmlFor={id}>{content+":"}</label>
            <input type="text" id={id} name={id} onChange={onChange} value={value}/><br></br>
        </>
    )
}

export {TextField};
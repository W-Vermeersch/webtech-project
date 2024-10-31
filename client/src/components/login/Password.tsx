function PasswordField({id, content, onChange, value}: {id: string, content: string, onChange: (e: any) => void , value: string}) {

    // const preventSubmit = (e: any) => {if (value == "") {
    //     e.stopPropagation();
    //     console.log("preventSubmit")
    // }}

    return (
        <>
            <label htmlFor={id}>{content+":"}</label>
            <input type="password" id={id} name={id} onChange={onChange} value={value}/><br></br>
        </>
    )
}

export {PasswordField};
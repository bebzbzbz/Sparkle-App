import Header from "../../components/Header/Header";
import MainButton from "../../components/MainButton/MainButton";

const EditProfile = () => {
    const editHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    return (  
        <>
            <Header 
                headerTitle="Edit Profile" 
                imgLeft="arrow-back"/>
            <section
                className="flex flex-col gap-3 items-center" >
                    
                <form
                    onSubmit={editHandler}
                    className="flex flex-col gap-5 items-center w-3/4">
                    <div
                        className="relative">
                        <img 
                            src="/svg/pic-empty.svg" 
                            alt="No Profile Picture" />
                        <input 
                            type="file" 
                            accept="image/*"
                            className="hidden" 
                            id="uploadImg"/>
                        <label htmlFor="uploadImg">
                            <img 
                                src="/svg/edit-filled.svg" alt="Edit Icon" 
                                className="absolute bottom-0 right-2 cursor-pointer"/>
                        </label>
                        
                    </div>
                    <input 
                        type="text" 
                        placeholder="Your Name"
                        />
                    <input 
                        type="text" 
                        placeholder="Username"
                        />
                    <input 
                        type="text" 
                        placeholder="Profession"
                        />
                    <input 
                        type="date" 
                        placeholder="Birthday"
                        />
                    <input 
                        type="email" 
                        placeholder="Email"
                        />
                    <input 
                        type="text" 
                        placeholder="Phone Number"
                        />
                    <select>
                        <option value="">Select a gender</option>
                        <option 
                            value="Nonbinary">Nonbinary</option>
                        <option 
                            value="Female">Female</option>
                        <option 
                            value="Male">Male</option>
                        <option 
                            value="None">Prefer not to disclose</option>
                    </select>
                    <input 
                        type="url" 
                        placeholder="Website"
                        />
                    <MainButton 
                        type="submit" 
                        textContent="Update"/>
                </form>
            </section>
        </>
    );
}

export default EditProfile;
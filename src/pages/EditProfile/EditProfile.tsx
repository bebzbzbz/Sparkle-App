import { useContext, useEffect, useState } from "react";
import { mainContext } from "../../context/MainProvider";
import supabase from "../../utils/supabase";
import MainButton from "../../components/MainButton/MainButton";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";
import IUser from "../../interfaces/IUser";

export default function EditProfile() {
	const navigate = useNavigate();
	const { loggedInUser, setLoggedInUser } = useContext(mainContext);

	const [updatedUser, setUpdatedUser] = useState<IUser>({
		id: "",
		username: "",
		profile_name: "",
		email: "",
		profile_image_url: "",
		profession: "",
		birthday: "",
		phone_number: "",
		gender: "",
		website: "",
		profile_desc: "",
		created_at: "",
		updated_at: "",
	});

	const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string>("");
	const [successMessage, setSuccessMessage] = useState<string>("");

	useEffect(() => {
		if (loggedInUser) {
			setUpdatedUser({
				id: loggedInUser.id ?? "",
				username: loggedInUser.username ?? "",
				profile_name: loggedInUser.profile_name ?? "",
				email: loggedInUser.email ?? "",
				profile_image_url: loggedInUser.profile_image_url ?? "",
				profession: loggedInUser.profession ?? "",
				birthday: loggedInUser.birthday ?? "",
				phone_number: loggedInUser.phone_number ?? "",
				gender: loggedInUser.gender ?? "",
				website: loggedInUser.website ?? "",
				profile_desc: loggedInUser.profile_desc ?? "",
				created_at: loggedInUser.created_at ?? "",
				updated_at: loggedInUser.updated_at ?? "",
			});
			setPreviewUrl(loggedInUser.profile_image_url || "");
		}
	}, [loggedInUser]);

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setProfilePhoto(file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setUpdatedUser((prev) => ({ ...prev, [name]: value }));
	};

	const handleUpdateProfile = async () => {
		let newImgUrl = previewUrl;

		if (profilePhoto) {
			const fileName = `${Date.now()}_${profilePhoto.name}`;
			const { error: uploadError } = await supabase
				.storage
				.from("profile-bucket")   // <-- hier korrigiert!
				.upload(fileName, profilePhoto, { upsert: true });

			if (uploadError) {
				console.error("Fehler beim Hochladen:", uploadError.message);
				return;
			}

			const { publicUrl } = supabase
				.storage
				.from("profile-bucket")  // <-- auch hier korrigiert
				.getPublicUrl(fileName).data;

			newImgUrl = publicUrl || "";
		}

		const { error } = await supabase
			.from("profiles")
			.update({
				username: updatedUser.username,
				profile_name: updatedUser.profile_name,
				profession: updatedUser.profession,
				birthday: updatedUser.birthday || null,
				phone_number: updatedUser.phone_number,
				gender: updatedUser.gender,
				website: updatedUser.website,
				profile_desc: updatedUser.profile_desc,
				profile_image_url: newImgUrl,
			})
			.eq("id", updatedUser.id);

		if (error) {
			console.error("Error while updating:", error.message);
		} else {
			console.log("Profile updated successfully!");
			setLoggedInUser({ ...updatedUser, profile_image_url: newImgUrl });
			setSuccessMessage("Profile updated successfully!");
			setTimeout(() => {
				setSuccessMessage("");
				navigate("/profile"); // Zurück zur vorherigen Seite
			}, 1500);
		}
	};

	return (
		<>
			<Header
				headerTitle="Edit Profile"
				imgLeft={<svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 1L1.24808 6.16795C0.654343 6.56377 0.654342 7.43623 1.24808 7.83205L9 13" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>} 
				leftAction={() => navigate(-1)}
				iconsRight={[]}
			/>
			<section className="flex flex-col gap-3 items-center">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleUpdateProfile();
					}}
					className="flex flex-col gap-5 items-center w-3/4"
				>
					<div className="relative">
						<img
							src={previewUrl || "/img/pic-empty.png"}
							alt={`Profilbild ${updatedUser.username}`}
							className="w-20 h-20 object-cover rounded-full"
						/>
						<input
							type="file"
							accept="image/*"
							className="hidden"
							id="uploadImg"
							onChange={handlePhotoChange}
						/>
						<label htmlFor="uploadImg" className="absolute bottom-0 right-0 cursor-pointer bg-light rounded-lg">
						<svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M22.3036 0.93182C24.4014 0.800706 26.4701 1.52912 28.0289 2.95681C29.4566 4.51561 30.1851 6.58431 30.0685 8.6967V22.3035C30.1996 24.4159 29.4566 26.4846 28.0435 28.0434C26.4847 29.471 24.4014 30.1995 22.3036 30.0683H8.69669C6.58428 30.1995 4.51557 29.471 2.95675 28.0434C1.52905 26.4846 0.800629 24.4159 0.931744 22.3035V8.6967C0.800629 6.58431 1.52905 4.51561 2.95675 2.95681C4.51557 1.52912 6.58428 0.800706 8.69669 0.93182H22.3036ZM14.0142 22.566L23.8187 12.7324C24.7074 11.8292 24.7074 10.3723 23.8187 9.48366L21.9248 7.58979C21.0216 6.68656 19.5647 6.68656 18.6615 7.58979L17.6854 8.58043C17.5397 8.72611 17.5397 8.97377 17.6854 9.11946C17.6854 9.11946 20.0018 11.4212 20.0455 11.4795C20.2058 11.6543 20.3077 11.8874 20.3077 12.1497C20.3077 12.6741 19.8852 13.1112 19.3462 13.1112C19.0986 13.1112 18.8655 13.0092 18.7052 12.8489L16.2723 10.4306C16.1557 10.3141 15.9518 10.3141 15.8352 10.4306L8.88612 17.3797C8.40537 17.8604 8.12857 18.5014 8.114 19.1861L8.02659 22.6388C8.02659 22.8282 8.08486 23.003 8.21598 23.1341C8.34709 23.2652 8.52191 23.3381 8.7113 23.3381H12.1349C12.8342 23.3381 13.5043 23.0613 14.0142 22.566Z" fill="currentColor"/></svg>
						</label>
					</div>

					<input
						type="text"
						name="profile_name"
						placeholder="Your Name"
						value={updatedUser.profile_name}
						onChange={handleInputChange}
					/>
					<input
						type="text"
						name="username"
						placeholder="Username"
						value={updatedUser.username}
						onChange={handleInputChange}
					/>
					<input
						type="text"
						name="profession"
						placeholder="status"
						value={updatedUser.profession}
						onChange={handleInputChange}
					/>
					<input
						type="date"
						name="birthday"
						placeholder="Birthday"
						value={updatedUser.birthday}
						onChange={handleInputChange}
					/>
					<input
						type="text"
						name="phone_number"
						placeholder="Phone Number"
						value={updatedUser.phone_number}
						onChange={handleInputChange}
					/>
					<select
						name="gender"
						value={updatedUser.gender || ""}
						onChange={handleInputChange}
					>
						<option value="" disabled>
							Select a gender
						</option>
						<option value="Female">Female</option>
						<option value="Male">Male</option>
						<option value="Genderqueer">Genderqueer</option>
						<option value="Private">Rather not disclose</option>
					</select>


					<input
						type="url"
						name="website"
						placeholder="Website"
						value={updatedUser.website}
						onChange={handleInputChange}
					/>
					<input
						type="text"
						name="profile_desc"
						placeholder="About You"
						value={updatedUser.profile_desc}
						onChange={handleInputChange}
					/>

					<MainButton type="submit" textContent="Update" />
				</form>

				{successMessage && (
					<p className="text-green-600 font-semibold mt-3">{successMessage}</p>
				)}
			</section>
		</>
	);
}

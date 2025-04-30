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
				imgLeft="arrow-back"
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
							src={previewUrl || "/svg/pic-empty.svg"}
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
						<label htmlFor="uploadImg">
							<img
								src="/svg/edit-filled.svg"
								alt="Edit Icon"
								className="absolute bottom-0 right-2 cursor-pointer"
							/>
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
						placeholder="Profession"
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
						{!updatedUser.gender && (
							<option value="" disabled hidden>
								Select a gender
							</option>
						)}
						<option value="Female">Female</option>
						<option value="Male">Male</option>
						<option value="Genderqueer">Genderqueer</option>
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

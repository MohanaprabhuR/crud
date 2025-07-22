"use client";
import { useEffect, useState, FormEvent } from "react";
import { supabase } from "../../../../lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { myAppHook } from "@/context/AppUtils";
import { useRouter } from "next/navigation";

interface Student {
  id?: string;
  name: string;
  email: string;
  phone_number: string;
  gender: string;
}

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState<Student>({
    name: "",
    email: "",
    phone_number: "",
    gender: "Male",
  });
  const [editId, setEditID] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUSerId] = useState<null>(null);
  const { setAuthToken, setIsLoggedIn, isLoggedIn, setUserProfile } =
    myAppHook();

  const router = useRouter();
  useEffect(() => {
    const handleLoginSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        toast("Faild to get user data");
        router.push("/auth/login");
        return;
      }
      if (data.session?.access_token) {
        setAuthToken(data.session?.access_token);
        setUSerId(data.session?.user.id);
        localStorage.setItem("acces_token", data.session?.access_token);

        setIsLoggedIn(true);
        setUserProfile({
          name: data.session.user?.user_metadata.fullname,
          email: data.session.user?.user_metadata.email,
          gender: data.session.user?.user_metadata.gender,
          phone: data.session.user?.user_metadata.phone,
        });

        localStorage.setItem(
          "user_profile",
          JSON.stringify({
            name: data.session.user?.user_metadata.fullname,
            email: data.session.user?.user_metadata.email,
            gender: data.session.user?.user_metadata.gender,
            phone: data.session.user?.user_metadata.phone,
          })
        );
      }
    };

    handleLoginSession();

    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }
  }, []);

  useEffect(() => {
    fetchStudent();
  }, []);

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const { email, phone_number } = form;

    if (!form.name.trim() || !form.email.trim() || !form.phone_number.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address.");
      return;
    }

    if (!phoneRegex.test(phone_number)) {
      toast.error("Enter a valid 10-digit mobile number.");
      return;
    }

    if (editId) {
      const { error } = await supabase
        .from("students")
        .update([form])
        .eq("id", editId);

      if (error) {
        toast.error(`Failed to update student table: ${error.message}`);
      } else {
        toast.success("Student data updated");
      }
      setEditID(null);
    } else {
      const { error } = await supabase.from("students").insert([form]);
      if (error) {
        toast.error(`Failed to create: ${error.message}`);
      } else {
        toast.success("Student added successfully");
      }
    }

    setForm({
      name: "",
      email: "",
      phone_number: "",
      gender: "Male",
    });
    fetchStudent();
  }

  async function fetchStudent() {
    setLoading(true);
    const { error, data } = await supabase.from("students").select("*");
    if (error) {
      toast.error(`Failed to read data: ${error.message}`);
    } else {
      setStudents(data || []);
    }
    setLoading(false);
  }

  function handleStudentEdit(student: Student) {
    setForm(student);
    if (student.id) {
      setEditID(student.id);
    }
  }

  async function handleStudentDelete(id: string) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      const { error } = await supabase.from("students").delete().eq("id", id);
      if (error) {
        toast.error(`Failed to delete student: ${error.message}`);
      } else {
        toast.success("Student deleted successfully");
        fetchStudent();
      }
    }
  }

  return (
    <div className="">
      <Navbar />
      <Toaster />
      <div className="mx-auto w-full max-w-[1142px] px-4 max-xl:max-w-[960px] max-lg:max-w-[720px] max-md:max-w-[540px] max-sm:max-w-full max-sm:px-0">
        <h1 className="text-center pb-10 font-area text-[40px] font-bold text-gray-900 max-lg:text-[32px] max-sm:text-[26px]">
          Student Management
        </h1>
        <div className="flex gap-[0_20px]">
          <div className="w-[40%]">
            <form
              onSubmit={handleFormSubmit}
              className="bg-white shadow-xl rounded-[24px] px-8 pt-6 pb-8 mb-4"
            >
              <div className="mb-3">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="shadow rounded w-full py-2 px-3 text-gray-700"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="text"
                  className="shadow rounded w-full py-2 px-3 text-gray-700"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Mobile Number
                </label>
                <input
                  type="text"
                  className="shadow rounded w-full py-2 px-3 text-gray-700"
                  value={form.phone_number}
                  onChange={(e) =>
                    setForm({ ...form, phone_number: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Gender
                </label>
                <select
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button
                className={`w-full text-white mt-4 font-medium rounded-lg text-sm px-5 py-2.5 ${
                  editId
                    ? "bg-green-700 hover:bg-green-800"
                    : "bg-blue-700 hover:bg-blue-800"
                }`}
              >
                {editId ? "Update" : "Add"}
              </button>
            </form>
          </div>

          <div className="w-[60%]">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <table className="table-auto w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Phone Number</th>
                    <th className="px-6 py-3">Gender</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr
                      key={student.id || index}
                      className="bg-white border-b border-gray-200"
                    >
                      <td className="px-6 py-4">{student.name}</td>
                      <td className="px-6 py-4">{student.email}</td>
                      <td className="px-6 py-4">{student.phone_number}</td>
                      <td className="px-6 py-4">{student.gender}</td>
                      <td className="px-6 py-4 flex">
                        <button
                          className="bg-green-700 hover:bg-green-800 text-white font-medium rounded-lg text-sm px-4 py-2 mr-2"
                          onClick={() => handleStudentEdit(student)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-700 hover:bg-red-800 text-white font-medium rounded-lg text-sm px-4 py-2"
                          onClick={() =>
                            student.id && handleStudentDelete(student.id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

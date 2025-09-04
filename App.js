import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';

const API ="http://localhost:4000";

function App() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({name:"",age:"",gender:"",disease:"",doctor:"",phone:"",address:""});
  const [editID, setEditID] = useState(null);
  const [editForm, setEditForm] = useState({name:"",age:"",gender:"",disease:"",doctor:"",phone:"",address:""});

  // Load patients
  async function load(){
    const res = await axios.get(`${API}/`);
    setPatients(res.data);
  }
  useEffect(()=>{ load(); },[]);

  // Add new patient
  async function addPatient(e){
    e.preventDefault();
    if(!form.name || !form.age || !form.gender || !form.disease || !form.doctor || !form.phone || !form.address)
      return alert("Enter all patient details");

    const res = await axios.post(`${API}/`, {
      name: form.name,
      age: Number(form.age),
      gender: form.gender,
      disease: form.disease,
      doctor: form.doctor,
      phone: Number(form.phone),
      address: form.address
    });
    setPatients([...patients, res.data]);
    setForm({name:"",age:"",gender:"",disease:"",doctor:"",phone:"",address:""});
  }

  // Start Edit
  function startEdit(p){
    setEditID(p._id);
    setEditForm({...p});
  }

  function cancelEdit(){
    setEditID(null);
  }

  // Save Edit
  async function saveEdit(id){
    if(!editForm.name || !editForm.age || !editForm.gender || !editForm.disease || !editForm.doctor || !editForm.phone || !editForm.address)
      return alert("Enter all fields");

    const res = await axios.put(`${API}/${id}`, {
      name: editForm.name,
      age: Number(editForm.age),
      gender: editForm.gender,
      disease: editForm.disease,
      doctor: editForm.doctor,
      phone: Number(editForm.phone),
      address: editForm.address
    });
    setPatients(patients.map(p => (p._id === id ? res.data : p)));
    setEditID(null);
  }

  // Remove
  async function remove(id){
    await axios.delete(`${API}/${id}`);
    setPatients(patients.filter(p => p._id !== id));
  }

  return (
    <div className="container mt-5">
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <h2 className='text-center mb-4'>Hospital Patient List</h2>
          <hr />
          <form onSubmit={addPatient}>
            <input type="text" className="form-control mb-2" placeholder="Enter Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
            <input type="number" className="form-control mb-2" placeholder="Enter Age" value={form.age} onChange={e=>setForm({...form,age:e.target.value})} required />
            <input type="text" className="form-control mb-2" placeholder="Enter Gender" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})} required />
            <input type="text" className="form-control mb-2" placeholder="Enter Disease" value={form.disease} onChange={e=>setForm({...form,disease:e.target.value})} required />
            <input type="text" className="form-control mb-2" placeholder="Enter Doctor Assigned" value={form.doctor} onChange={e=>setForm({...form,doctor:e.target.value})} required />
            <input type="number" className="form-control mb-2" placeholder="Enter Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required />
            <input type="text" className="form-control mb-2" placeholder="Enter Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} required />
            <button className="btn btn-primary w-100">Submit</button>
          </form>
        </div>
      </div>

      {/* List Patients */}
      <div className="row mt-5">
        <div className="col">
          <h3>Patients List</h3>
          {patients.length === 0 ? (
            <p>No patients found</p>
          ) : (
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Disease</th>
                  <th>Doctor</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th style={{width:"200px"}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(p=>(
                  <tr key={p._id}>
                    {editID === p._id ? (
                      <>
                        <td><input type="text" className="form-control" value={editForm.name} onChange={e=>setEditForm({...editForm,name:e.target.value})}/></td>
                        <td><input type="number" className="form-control" value={editForm.age} onChange={e=>setEditForm({...editForm,age:e.target.value})}/></td>
                        <td><input type="text" className="form-control" value={editForm.gender} onChange={e=>setEditForm({...editForm,gender:e.target.value})}/></td>
                        <td><input type="text" className="form-control" value={editForm.disease} onChange={e=>setEditForm({...editForm,disease:e.target.value})}/></td>
                        <td><input type="text" className="form-control" value={editForm.doctor} onChange={e=>setEditForm({...editForm,doctor:e.target.value})}/></td>
                        <td><input type="number" className="form-control" value={editForm.phone} onChange={e=>setEditForm({...editForm,phone:e.target.value})}/></td>
                        <td><input type="text" className="form-control" value={editForm.address} onChange={e=>setEditForm({...editForm,address:e.target.value})}/></td>
                        <td>
                          <button className="btn btn-success me-2" onClick={()=>saveEdit(p._id)}>Save</button>
                          <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{p.name}</td>
                        <td>{p.age}</td>
                        <td>{p.gender}</td>
                        <td>{p.disease}</td>
                        <td>{p.doctor}</td>
                        <td>{p.phone}</td>
                        <td>{p.address}</td>
                        <td>
                          <button className="btn btn-warning me-2" onClick={()=>startEdit(p)}>Edit</button>
                          <button className="btn btn-danger" onClick={()=>remove(p._id)}>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

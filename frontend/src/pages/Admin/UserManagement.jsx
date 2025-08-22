import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser, createUser, updateUser } from '../../utils/services/userService'; // createUser ve updateUser eklendi
import './UserManagement.css'; // Yeni CSS dosyasını import et

// Frontend tarafında UserRole enum'ını tanımla
const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'USER', // Varsayılan rol USER
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setCurrentUser(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'USER',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role, // Mevcut rolü formda göster
      password: '', // Şifreyi düzenlerken boş bırak
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentUser) {
        // Kullanıcı güncelleme
        await updateUser(currentUser.id, formData);
      } else {
        // Yeni kullanıcı oluşturma
        await createUser(formData);
      }
      fetchUsers(); // Listeyi güncelle
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteUser(userId);
        fetchUsers(); // Silme sonrası listeyi güncelle
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div>Kullanıcılar yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div className="user-management">
      <h2>Kullanıcı Yönetimi</h2>
      <button onClick={handleAddUser} className="add-user-button">Yeni Kullanıcı Ekle</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ad</th>
            <th>Soyad</th>
            <th>E-posta</th>
            <th>Rol</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Düzenle</button>
                <button onClick={() => handleDelete(user.id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{currentUser ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Ekle'}</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Ad:
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </label>
              <label>
                Soyad:
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </label>
              <label>
                E-posta:
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </label>
              <label>
                Şifre: {/* Sadece yeni kullanıcı eklerken veya şifre değiştirirken göster */}
                <input type="password" name="password" value={formData.password} onChange={handleChange} required={!currentUser} />
              </label>
              <label>
                Rol:
                <select name="role" value={formData.role} onChange={handleChange} required>
                  {Object.values(UserRole).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </label>
              <button type="submit">Kaydet</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>İptal</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

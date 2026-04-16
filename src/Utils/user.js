export const logout = async () => {
  const res = await fetch('/api/v1/auth/logout', {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type":"application/json"
    }
  });
  const data = res.json();
  return data;
};

export const login = async (formData) => {
  const res = await fetch("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        email: formData.email,
        password: formData.password
    })
  });
  const data = await res.json();
  return data;
};

export const signup = async (formData) => {
  const res = await fetch('/api/v1/auth/signup', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    })
  });

  const data = await res.json();
  return data;
};

export const signupAdmin = async (formData) => {
  const res = await fetch('/api/v1/auth/signup-adm', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    }),
  });

  const data = await res.json();
  return data;
};

export const updateMe = async (formData) => {
  const res = await fetch('api/v1/user/update-me', {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      photo: formData.photo,
      address: formData.address
    })
  });

  const data = await res.json();
  return data;
};

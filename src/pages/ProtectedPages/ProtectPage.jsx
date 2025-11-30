import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import Loading from "../../components/layout/Loading";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const startTime = Date.now(); // Catat waktu mulai
    const minLoadingTime = 1000; // Minimum 1 detik loading

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        dispatch({
          type: "STORE_DATA_USER",
          payload: user,
        });

        // Hitung berapa lama sudah loading
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

        // Tunggu sampai minimum loading time tercapai
        setTimeout(() => {
          // Trigger animasi slide up
          setLoading(false);

          // Tunggu animasi selesai baru unmount
          setTimeout(() => {
            setShowLoading(false);
          }, 1000); // Duration animasi
        }, remainingTime);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate, dispatch]);

  if (showLoading) return <Loading isLoading={loading} />;

  return user ? children : null;
};

export default ProtectedRoute;

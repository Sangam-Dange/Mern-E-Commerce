import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { Container } from "react-bootstrap";
import HomeScreen from "./screens/HomeScreen.jsx";
import ProductScreen from "./screens/ProductScreen.jsx";
import CartScreen from "./screens/CartScreen.jsx";
import LoginScreen from "./screens/LoginScreen.jsx";
import RegisterScreen from "./screens/RegisterScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import ShippingScreen from "./screens/ShippingScreen.jsx";
import { useSelector } from "react-redux";
import PaymentScreen from "./screens/PaymentScreen.jsx";
import PlaceOrderScreen from "./screens/PlaceOrderScreen.jsx";
import OrderScreen from "./screens/OrderScreen.jsx";
import UsersListScreen from "./screens/UsersListScreen.jsx";
import UserEditScreen from "./screens/UserEditScreen.jsx";
import ProductListScreen from "./screens/ProductListScreen.jsx";
import ProductEditScreen from "./screens/ProductEditScreen.jsx";
import OrderListScreen from "./screens/OrderListScreen.jsx";

const App = () => {
  const {  userInfo } = useSelector((state) => state.userLogin);


  return (
    <Router>
      <Header />
      <main className="py-3">
        <Routes>
          <Route path="/order/:id" element={ userInfo ? (<Container> <OrderScreen /> </Container>) : <Navigate to="/login" />} exact/>
          <Route path="/placeorder" element={ userInfo ? (<Container> <PlaceOrderScreen /> </Container>) : <Navigate to="/login" />} exact/>
          <Route path="/payment" element={ userInfo ? (<Container> <PaymentScreen /> </Container>) : <Navigate to="/login" />} exact/>
          <Route path="/shipping" element={ userInfo ? (<Container> <ShippingScreen /> </Container>) : <Navigate to="/login" />} exact/>
          <Route path="/login" element={ <Container> <LoginScreen /> </Container>} exact/>
          <Route path="/register" element={ <Container> <RegisterScreen /> </Container>} exact/>
          <Route path="/profile" element={ <Container> <ProfileScreen /> </Container>} exact/>
          <Route path="/product/:id" element={ <Container> <ProductScreen /> </Container>} />
          <Route path='/cart' element={ <Container> <CartScreen/> </Container>} />
          <Route path='/cart/:id' element={ <Container> <CartScreen/> </Container>} />
          <Route path='/admin/userlist' element={ <Container> <UsersListScreen/> </Container>} />
          <Route path='/admin/user/:id/edit' element={ <Container> <UserEditScreen/> </Container>} />
          <Route path='/admin/productlist' element={ <Container> <ProductListScreen/> </Container>}exact />
          <Route path='/admin/productlist/:pageNumber' element={ <Container> <ProductListScreen/> </Container>} exact />
          <Route path='/admin/product/:id/edit' element={ <Container> <ProductEditScreen/> </Container>} />
          <Route path='/admin/orderlist' element={ <Container> <OrderListScreen/> </Container>} />
          <Route path="/search/:keyword" element={ <Container> <HomeScreen /> </Container>} exact/>
          <Route path="/page/:pageNumber" element={ <Container> <HomeScreen /> </Container>} exact/>
          <Route path="/search/:keyword/page/:pageNumber" element={ <Container> <HomeScreen /> </Container>} exact/>
          <Route path="/" element={ <Container> <HomeScreen /> </Container>} exact/>
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;

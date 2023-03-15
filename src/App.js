import { useEffect, useState} from 'react'
import { db, auth } from './firebaseConnection'
import { doc, setDoc, collection, addDoc, getDocs, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore'
import './app.css'
import { ToastContainer,toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
function App() {

  const [titulo,setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [posts, setPosts] = useState([])
  const [idPost, setIdPost] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [user, setUser] = useState(false)
  const [userDetails, setUserDetails] = useState({})

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPosts = []
        snapshot.forEach(doc => {
          listaPosts.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          })
        });
        setPosts(listaPosts)
      })
    }

    loadPosts()
    //buscarPosts()
  })

  async function handleApp() {
    // await setDoc(doc(db, "posts", "12345"), {
    //   titulo: titulo,
    //   autor: autor
    // }).then(() => {
    //     console.log("Dados registados com sucesso!")
    //   }
    // ).catch((error) => {
    //   console.log({error})
    // })

    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor
    })
    .then(() => {
          console.log("Dados registados com sucesso!")
          setTitulo('')
          setAutor('')
        }
      ).catch((error) => {
        console.log({error})
      })
  }

  async function buscarPosts(){
    const postsRef = collection(db, "posts")
    if(postsRef){
      await getDocs(postsRef)
      .then((snapshot) => {
        let lista = []
        snapshot.forEach(doc => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          })
        });
        setPosts(lista)
      }).catch(error => {
        console.log(error)
      })
    }else{
      const notify = () => toast.success("Não há postagens!");
      return (
        <div>
          <button onClick={notify}>Notify</button>          
          <ToastContainer />
        </div>
        )
    }
  }

  async function editarPost(){
    const docRef = doc(db, "posts", idPost)
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor
    })
    .then(() => {
      console.log("POST ATUALIZADO")
      setIdPost('')
      setTitulo('')
      setAutor('')
    })
    .catch(() => {
      console.log("ERRO AO ATUALIZAR POST")
    })
  }

  async function excluirPost (postId) {
    const docRef = doc(db, "posts", postId)
    await deleteDoc(docRef)
    .then(async () => {
      alert("POST DELETADO COM SUCESSO.")        
    })
    .catch(error =>{
      alert(`ERRO AO DELETAR: ${error}`)
    })
  }

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
    .then(() => {
      setEmail('')
      setSenha('')
      alert("USUARIO CADASTRADO COM SUCESSO.")
    })
    .catch(error => {
      console.log(`ERRO AO CADASTRAR USUARIO: ${error}`)
      if(error.code === 'auth/weak-password'){
        alert("Senha muito fraca")
      }else if(error.code === 'auth/email-already-in-use'){
        alert('EMAIL JA EXISTE')
      }
    })
  }

  async function logarUsuario(){
    await signInWithEmailAndPassword(auth,email,senha)
    .then((value ) => {
      setUserDetails({
        uid:value.user.uid,
        email: value.user.email
      })
      setUser(true)
      setEmail('')
      setSenha('')
      alert("Usuario logado com sucesso")
    })
    .catch((error) => {
      alert(`Erro ao tentar logar: ${error}`)
    })
  }

  async function deslogarUsuario() {
    await signOut(auth)
    setUser(false)
    setUserDetails({})
    alert("Usuario deslogado com sucesso.")
  }

  return (
    <div className="App">
      <h1>HELLO WORD!  :)</h1><br/>
      
      {user && (
          <div>
            <strong>Seja bem vindo {userDetails.email}</strong><br/>
            <button onClick={deslogarUsuario}>Logout</button>
          </div>
      )}

      <div className='container'>
          <h2>Usuarios</h2>
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Digite seu email'
          /><br/>
          <label>Senha</label>
          <input
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder='Digite sua senha'
          /><br/>
          <button onClick={novoUsuario}>Cadastrar</button>
          <button onClick={logarUsuario}>Fazer login</button>
        </div>
        <br/><br/>
        <hr/>
        <br/>
      <div className="container">
          <h2>POSTS</h2>
          <label>ID do Post</label>
          <input
            type="text"
            placeholder="Digite o Id do post"
            value={idPost}
            onChange={(e) => setIdPost(e.target.value)}
          ></input>
          <label>Titulo:</label>
          <textarea
            type="text"
            placeholder="Digite o titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <label>Autor:</label>
          <input
            type="text"
            placeholder="Autor do post"
            value={autor}

            onChange={(e) => setAutor(e.target.value)}
          /><br/>

          <button onClick={handleApp}>Cadastrar</button><br/>
          <button onClick={buscarPosts}>Buscar posts</button><br/>
          <button onClick={editarPost}>Atualizar posts</button><br/>

          <ul>
            {posts.map(doc => {
              return(
                <>
                  <li key={doc.id}>
                    <span>Titulo: {doc.titulo}</span>
                    <br></br>
                    <span>Autor: {doc.autor}</span><br/>
                    <button onClick={ () => excluirPost(doc.id)}>Excluir</button>
                    <br></br>
                    <br/>
                  </li>
                </>  
              )
            })}
          </ul>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;

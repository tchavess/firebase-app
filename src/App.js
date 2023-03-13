import { useState} from 'react'
import { db } from './firebaseConnection'
import { doc, setDoc, collection, addDoc, getDocs, updateDoc } from 'firebase/firestore'
import './app.css'
import { ToastContainer,toast } from 'react-toastify';
function App() {

  const [titulo,setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [posts, setPosts] = useState([])
  const [idPost, setIdPost] = useState('')

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
        toast.success("Não há postagens!");
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

  return (
    <div className="App">
     <h1>HELLO WORD!  :)</h1>
     <div className="container">
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
        />

        <button onClick={handleApp}>Cadastrar</button>
        <button onClick={buscarPosts}>Buscar posts</button>
        <button onClick={editarPost}>Atualizar posts</button>

        <ul>
          {posts.map(doc => {
            return(
              <>
                <li key={doc.id}>
                  <span>Titulo: {doc.titulo}</span>
                  <br></br>
                  <span>Autor: {doc.autor}</span>
                  <br></br>
                  <br/>
                </li>
              </>  
            )
          })}
        </ul>
     </div>
    </div>
  );
}

export default App;

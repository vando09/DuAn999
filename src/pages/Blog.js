import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:3000/api/posts";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPosts = async () => {
      try {
        const response = await axios.get(API_URL, { signal: controller.signal });
        console.log("Dữ liệu API:", response.data);

        if (response.data && Array.isArray(response.data.data)) {
          setPosts(response.data.data);
        } else {
          setError("Dữ liệu không hợp lệ.");
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Lỗi khi lấy bài viết:", err);
          setError("Không thể tải danh sách bài viết.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    return () => controller.abort();
  }, []);

  if (loading) return <p>Đang tải bài viết...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <section className="blog spad">
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-4 col-md-5">
            <aside className="blog__sidebar">
              <div className="blog__sidebar__search">
                <form>
                  <input type="text" placeholder="Search..." />
                  <button type="submit">
                    <span className="icon_search"></span>
                  </button>
                </form>
              </div>
              <div className="blog__sidebar__item">
                <h4>Categories</h4>
                <ul>
                  <li><a href="#">All</a></li>
                  <li><a href="#">Beauty (20)</a></li>
                  <li><a href="#">Food (5)</a></li>
                  <li><a href="#">Life Style (9)</a></li>
                  <li><a href="#">Travel (10)</a></li>
                </ul>
              </div>
            </aside>
          </div>

          {/* Posts List */}
          <div className="col-lg-8 col-md-7">
            <div className="row">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.id} className="col-lg-6 col-md-6 col-sm-6">
                    <div className="blog__item">
                      <div className="blog__item__pic">
                        <img
                          src={post.image || "/default-image.jpg"}
                          alt={post.title}
                          className="img-fluid"
                        />
                      </div>
                      <div className="blog__item__text">
                        <ul>
                          <li>
                            <i className="fa fa-user"></i> Tác giả: {post.user_id}
                          </li>
                          <li>
                            <i className="fa fa-calendar-o"></i> {new Date(post.created_at).toLocaleDateString()}
                          </li>
                        </ul>
                        <h5>
                          <Link to={`/blogdetail/${post.id}`}>{post.title}</Link>
                        </h5>
                        <p>{post.content.substring(0, 30)}...</p>
                        <Link to={`/blogdetail/${post.id}`} className="blog__btn">
                          Đọc tiếp <span className="arrow_right"></span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Không có bài viết nào.</p> 
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Posts;

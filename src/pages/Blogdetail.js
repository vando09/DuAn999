import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";


// URL API lấy bài viết và bài viết liên quan
const API_URL = "http://localhost:3000/api/posts";

const BlogDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [post, setPost] = useState(null); // Lưu bài viết
  const [relatedPosts, setRelatedPosts] = useState([]); // Bài viết liên quan
  const [loading, setLoading] = useState(true); // Trạng thái đang tải
  const [error, setError] = useState(null); // Trạng thái lỗi

  useEffect(() => {
    // Hàm lấy bài viết từ API
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        setPost(response.data.data[0]); // Lấy bài viết từ mảng "data"
        const relatedResponse = await axios.get(`${API_URL}?limit=5&exclude=${id}`);
        setRelatedPosts(relatedResponse.data.data); // Lấy bài viết liên quan
      } catch (err) {
        setError("Không thể tải nội dung bài viết.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost(); // Gọi hàm lấy bài viết
  }, [id]);

  if (loading) return <p>Đang tải bài viết...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!post) return <p>Bài viết không tồn tại.</p>;

  // Xử lý ảnh, trong trường hợp chỉ có một URL ảnh duy nhất
  const image = post.image || "/default-image.jpg"; // Nếu không có ảnh, dùng ảnh mặc định

  return (
    <section className="blog-detail spad">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="blog__details__title">
              <h2>{post.title}</h2>
              <ul>
                <li>
                  <i className="fa fa-user"></i> Tác giả: {post.user_id || "Chưa có tác giả"}
                </li>
                <li>
                  <i className="fa fa-calendar-o"></i> {new Date(post.created_at).toLocaleDateString()}
                </li>
              </ul>
            </div>
            <div className="blog__details__content">
              {/* Hiển thị ảnh bài viết nhỏ lại */}
              <img
                src={image}
                alt={post.title}
                className="img-fluid blog__details__image"
                style={{ width: "100%", maxWidth: "500px", marginBottom: "20px" }}
              />

              {/* Hiển thị nội dung bài viết dùng CKEditor */}
              <div className="blog__editor">
                <CKEditor
                  editor={ClassicEditor}
                  data={post.content || "Không có nội dung."}
                  config={{
                    toolbar: [], // Ẩn toolbar nếu chỉ đọc
                    readOnly: true, // Chế độ chỉ đọc
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bài viết liên quan */}
          <div className="col-lg-4">
            <div className="related-posts">
              <h4>Bài viết liên quan</h4>
              <ul>
                {relatedPosts.map((relatedPost) => (
                  <li key={relatedPost.id}>
                    <a href={`/blogdetail/${relatedPost.id}`} className="related-post-item">
                      <h5>{relatedPost.title}</h5>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetail;

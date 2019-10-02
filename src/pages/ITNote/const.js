// 工具栏配置
const toolbarOptions = [
    ["bold", "italic", "underline", "link"], // toggled buttons
    ["blockquote", "code-block"],
  
    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ direction: "rtl" }], // text direction
  
    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
  
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],
    ["image"]
  ];

  export default toolbarOptions;
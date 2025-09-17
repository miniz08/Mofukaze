# 🍓 选择 Node.js 官方镜像作为基础镜像
FROM node:18

# 🍓 设定镜像作者信息（可选）
LABEL maintainer="初音未来 <miku@example.com>"

# 🍓 设置工作目录（镜像内的 /app 目录）
WORKDIR /app

# 🍓 拷贝当前目录（包含 package.json、src、config 等所有内容）到镜像的 /app 目录
COPY . .

# 🍓 安装项目依赖（使用 package.json 和 package-lock.json）
RUN npm install

# 🍓 （可选）如果需要构建项目（例如 React/Vue），可以添加：
# RUN npm run build

# 🍓 设置环境变量（这里设置为生产环境）
ENV NODE_ENV=production

# 🍓 暴露应用运行的端口（根据你的项目修改）
EXPOSE 3000

# 🍓 启动应用（这里假设你的启动脚本是 'npm start'）
CMD ["npm", "run","dev"]

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy TẤT CẢ các file .csproj vào đúng cấu trúc thư mục
COPY ["WebApi/WebApi.csproj", "WebApi/"]
COPY ["BusinessObject/BusinessObject.csproj", "BusinessObject/"]
COPY ["DAOs/DAOs.csproj", "DAOs/"]
COPY ["DTOs/DTOs.csproj", "DTOs/"]
COPY ["Repositories/Repositories.csproj", "Repositories/"]
COPY ["Services/Services.csproj", "Services/"]

# Restore WebApi (nó sẽ tự restore các dependencies đi kèm)
RUN dotnet restore "./WebApi/WebApi.csproj"

# Copy toàn bộ code còn lại
COPY . .
WORKDIR "/src/WebApi"
RUN dotnet build "./WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WebApi.dll"]